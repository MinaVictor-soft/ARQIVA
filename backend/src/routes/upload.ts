import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';

const router = Router();

// Ensure uploads directory exists
// __dirname at runtime = dist/routes/, so go ../../ to reach backend/public/uploads/
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif, svg)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// POST /api/upload — admin only
router.post('/', authenticateToken, authorizeRole('admin'), upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 400, 'No file uploaded');
  const url = `/uploads/${req.file.filename}`;
  return sendResponse(res, 201, 'File uploaded', { url, filename: req.file.filename, size: req.file.size });
});

// DELETE /api/upload/:filename — admin only
router.delete('/:filename', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) return sendError(res, 404, 'File not found');
  fs.unlinkSync(filePath);
  return sendResponse(res, 200, 'File deleted');
});

export default router;
