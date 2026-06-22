import { Router, Request, Response } from 'express';
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
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

function getPrivateDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR || '';
  if (!dir) throw new Error('PRIVATE_OBJECT_DIR not set');
  return dir;
}

function parseObjectPath(fullPath: string): { bucketName: string; objectName: string } {
  const p = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
  const parts = p.split('/').filter(Boolean);
  if (parts.length < 2) throw new Error('Invalid object path');
  return { bucketName: parts[0], objectName: parts.slice(1).join('/') };
}

// POST /api/upload — admin only, accepts multipart file, uploads to GCS, returns /objects/... URL
router.post('/', authenticateToken, authorizeRole('admin'), upload.single('file'), async (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return sendError(res, 400, 'No file uploaded');
  try {
    const privateDir = getPrivateDir();
    const ext = path.extname(file.originalname).toLowerCase();
    const objectId = `${randomUUID()}${ext}`;
    const fullPath = `${privateDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const gcsFile = bucket.file(objectName);
    await gcsFile.save(file.buffer, { contentType: file.mimetype, resumable: false });
    const objectPath = `/objects/uploads/${objectId}`;
    return sendResponse(res, 201, 'File uploaded', { url: objectPath, filename: file.originalname, size: file.size });
  } catch (err: any) {
    console.error('Upload error:', err);
    return sendError(res, 500, 'Failed to upload file: ' + (err.message || 'unknown error'));
  }
});

// DELETE /api/upload/:filename — no-op (object removed when DB record deleted)
router.delete('/:filename', authenticateToken, authorizeRole('admin'), (_req: Request, res: Response) => {
  return sendResponse(res, 200, 'File removed');
});

export default router;
