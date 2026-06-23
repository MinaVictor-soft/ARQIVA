import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';
import { objectStorageClient } from '../replit_integrations/object_storage';

const router = Router();

const storage = multer.memoryStorage();
const fileFilter = (_req: Request, file: any, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files allowed (jpg, jpeg, png, webp, gif, svg)'));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

function getPrivateDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR || '';
  if (!dir) throw new Error('Object storage not configured (PRIVATE_OBJECT_DIR missing)');
  return dir;
}

function parseObjectPath(fullPath: string): { bucketName: string; objectName: string } {
  const p = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
  const parts = p.split('/').filter(Boolean);
  if (parts.length < 2) throw new Error('Invalid object path format');
  return { bucketName: parts[0], objectName: parts.slice(1).join('/') };
}

// POST /api/upload — admin only, multipart → GCS → returns /objects/... URL
router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  (req: Request, res: Response, next: NextFunction) => {
    // Wrap multer so its errors are returned as JSON, not Express HTML error pages
    upload.single('file')(req, res, (err: any) => {
      if (err) {
        console.error('Multer error:', err.message);
        const msg = err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large (max 20 MB)'
          : err.message || 'File upload error';
        return sendError(res, 400, msg);
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return sendError(res, 400, 'No file received — make sure the field name is "file"');
    try {
      const privateDir = getPrivateDir();
      // Ensure extension is present; fall back to mimetype-derived extension
      let ext = path.extname(file.originalname).toLowerCase();
      if (!ext && file.mimetype) {
        const map: Record<string, string> = {
          'image/jpeg': '.jpg', 'image/png': '.png',
          'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg',
        };
        ext = map[file.mimetype] || '.jpg';
      }
      const objectId = `${randomUUID()}${ext}`;
      const fullPath = `${privateDir}/uploads/${objectId}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);

      console.log(`Uploading to GCS: bucket=${bucketName} object=${objectName} size=${file.size}`);
      const bucket = objectStorageClient.bucket(bucketName);
      const gcsFile = bucket.file(objectName);
      await gcsFile.save(file.buffer, { contentType: file.mimetype, resumable: false });

      const objectPath = `/objects/uploads/${objectId}`;
      console.log(`Upload OK: ${objectPath}`);
      return sendResponse(res, 201, 'File uploaded', { url: objectPath, filename: file.originalname, size: file.size });
    } catch (err: any) {
      console.error('Upload error:', err.message, err.stack?.split('\n')[1]);
      return sendError(res, 500, 'Upload failed: ' + (err.message || 'unknown error'));
    }
  }
);

// DELETE /api/upload/:filename — no-op placeholder
router.delete('/:filename', authenticateToken, authorizeRole('admin'), (_req: Request, res: Response) => {
  return sendResponse(res, 200, 'File removed');
});

export default router;
