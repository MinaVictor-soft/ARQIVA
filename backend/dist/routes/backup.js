"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const backup_1 = require("../utils/backup");
const router = (0, express_1.Router)();
// All backup routes require admin auth
router.use(auth_1.authenticateToken, (0, auth_1.authorizeRole)('admin'));
// GET /api/admin/backups — list all backups stored in object storage
router.get('/', async (_req, res) => {
    try {
        const backups = await (0, backup_1.listBackups)();
        return (0, response_1.sendResponse)(res, 200, 'Backups retrieved', backups);
    }
    catch (err) {
        console.error('List backups error:', err.message);
        return (0, response_1.sendError)(res, 500, 'Failed to list backups: ' + err.message);
    }
});
// POST /api/admin/backups — trigger a manual backup now
router.post('/', async (_req, res) => {
    try {
        const meta = await (0, backup_1.saveBackupToStorage)('manual');
        // Try to send email (non-blocking — don't fail the request if email fails)
        try {
            const buf = await (0, backup_1.downloadBackup)(meta.filename);
            await (0, backup_1.sendBackupEmail)(meta, buf);
        }
        catch { /* email optional */ }
        return (0, response_1.sendResponse)(res, 201, 'Backup created', meta);
    }
    catch (err) {
        console.error('Manual backup error:', err.message);
        return (0, response_1.sendError)(res, 500, 'Backup failed: ' + err.message);
    }
});
// GET /api/admin/backups/:filename — download a specific backup as JSON
router.get('/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename.match(/^backup-[\w\-]+\.json$/)) {
            return (0, response_1.sendError)(res, 400, 'Invalid filename');
        }
        const buf = await (0, backup_1.downloadBackup)(filename);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buf.length);
        return res.send(buf);
    }
    catch (err) {
        console.error('Download backup error:', err.message);
        return (0, response_1.sendError)(res, 404, 'Backup not found: ' + err.message);
    }
});
// GET /api/admin/backups/:filename/download-full — download tar.gz with DB JSON + all images
router.get('/:filename/download-full', async (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename.match(/^backup-[\w\-]+\.json$/)) {
            return (0, response_1.sendError)(res, 400, 'Invalid filename');
        }
        console.log(`[Backup] Building full archive for ${filename}...`);
        const { buffer, archiveName } = await (0, backup_1.createFullBackupArchive)(filename);
        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);
        res.setHeader('Content-Length', buffer.length);
        return res.send(buffer);
    }
    catch (err) {
        console.error('Full backup download error:', err.message);
        return (0, response_1.sendError)(res, 500, 'Full backup failed: ' + err.message);
    }
});
// POST /api/admin/backups/:filename/restore — restore DB from a backup file
router.post('/:filename/restore', async (req, res) => {
    try {
        const { filename } = req.params;
        if (!filename.match(/^backup-[\w\-]+\.json$/)) {
            return (0, response_1.sendError)(res, 400, 'Invalid filename');
        }
        // First save a backup of current state before overwriting
        await (0, backup_1.saveBackupToStorage)('pre-restore').catch(() => { });
        const counts = await (0, backup_1.restoreFromBackup)(filename);
        console.log(`✓ Restored from ${filename}:`, counts);
        return (0, response_1.sendResponse)(res, 200, `Restored from ${filename}`, { restoredCounts: counts });
    }
    catch (err) {
        console.error('Restore error:', err.message);
        return (0, response_1.sendError)(res, 500, 'Restore failed: ' + err.message);
    }
});
exports.default = router;
