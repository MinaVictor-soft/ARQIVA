import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';

const router = Router();

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: any, cb: FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif, svg)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// POST /api/upload — stores image as base64 data URL (permanent, database-backed)
router.post('/', authenticateToken, authorizeRole('admin'), upload.single('file'), (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return sendError(res, 400, 'No file uploaded');
  const base64 = file.buffer.toString('base64');
  const mime = file.mimetype || 'image/jpeg';
  const url = `data:${mime};base64,${base64}`;
  return sendResponse(res, 201, 'File uploaded', { url, filename: file.originalname, size: file.size });
});

// DELETE /api/upload/:filename — no-op for data URLs (data is removed when DB record is deleted)
router.delete('/:filename', authenticateToken, authorizeRole('admin'), (_req: Request, res: Response) => {
  return sendResponse(res, 200, 'File removed');
});

export default router;
