import { Router, Request, Response } from 'express';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';
import { ObjectStorageService } from '../replit_integrations/object_storage';

const router = Router();
const objectStorage = new ObjectStorageService();

// POST /api/upload/request-url — admin only, returns presigned PUT URL for direct-to-storage upload
router.post('/request-url', authenticateToken, authorizeRole('admin'), async (_req: Request, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return sendResponse(res, 200, 'Upload URL generated', { uploadURL, objectPath });
  } catch (err: any) {
    console.error('Object storage presigned URL error:', err);
    return sendError(res, 500, 'Failed to generate upload URL');
  }
});

// DELETE /api/upload/:filename — no-op (object is removed when DB record is deleted)
router.delete('/:filename', authenticateToken, authorizeRole('admin'), (_req: Request, res: Response) => {
  return sendResponse(res, 200, 'File removed');
});

export default router;
