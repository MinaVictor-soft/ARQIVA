import { Router, Response } from 'express';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';
import { saveBackupToStorage, listBackups, downloadBackup, restoreFromBackup, sendBackupEmail } from '../utils/backup';
import { CustomRequest } from '../utils/types';

const router = Router();

// All backup routes require admin auth
router.use(authenticateToken, authorizeRole('admin'));

// GET /api/admin/backups — list all backups stored in object storage
router.get('/', async (_req: CustomRequest, res: Response) => {
  try {
    const backups = await listBackups();
    return sendResponse(res, 200, 'Backups retrieved', backups);
  } catch (err: any) {
    console.error('List backups error:', err.message);
    return sendError(res, 500, 'Failed to list backups: ' + err.message);
  }
});

// POST /api/admin/backups — trigger a manual backup now
router.post('/', async (_req: CustomRequest, res: Response) => {
  try {
    const meta = await saveBackupToStorage('manual');
    // Try to send email (non-blocking — don't fail the request if email fails)
    try {
      const buf = await downloadBackup(meta.filename);
      await sendBackupEmail(meta, buf);
    } catch { /* email optional */ }
    return sendResponse(res, 201, 'Backup created', meta);
  } catch (err: any) {
    console.error('Manual backup error:', err.message);
    return sendError(res, 500, 'Backup failed: ' + err.message);
  }
});

// GET /api/admin/backups/:filename — download a specific backup as JSON
router.get('/:filename', async (req: CustomRequest, res: Response) => {
  try {
    const { filename } = req.params;
    if (!filename.match(/^backup-[\w\-]+\.json$/)) {
      return sendError(res, 400, 'Invalid filename');
    }
    const buf = await downloadBackup(filename);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buf.length);
    return res.send(buf);
  } catch (err: any) {
    console.error('Download backup error:', err.message);
    return sendError(res, 404, 'Backup not found: ' + err.message);
  }
});

// POST /api/admin/backups/:filename/restore — restore DB from a backup file
router.post('/:filename/restore', async (req: CustomRequest, res: Response) => {
  try {
    const { filename } = req.params;
    if (!filename.match(/^backup-[\w\-]+\.json$/)) {
      return sendError(res, 400, 'Invalid filename');
    }
    // First save a backup of current state before overwriting
    await saveBackupToStorage('pre-restore').catch(() => {});
    const counts = await restoreFromBackup(filename);
    console.log(`✓ Restored from ${filename}:`, counts);
    return sendResponse(res, 200, `Restored from ${filename}`, { restoredCounts: counts });
  } catch (err: any) {
    console.error('Restore error:', err.message);
    return sendError(res, 500, 'Restore failed: ' + err.message);
  }
});

export default router;
