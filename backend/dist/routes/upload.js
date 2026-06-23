"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const auth_1 = require("../utils/auth");
const response_1 = require("../utils/response");
const object_storage_1 = require("../replit_integrations/object_storage");
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext))
        cb(null, true);
    else
        cb(new Error('Only image files allowed (jpg, jpeg, png, webp, gif, svg)'));
};
const upload = (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
function getPrivateDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR || '';
    if (!dir)
        throw new Error('PRIVATE_OBJECT_DIR not set');
    return dir;
}
function parseObjectPath(fullPath) {
    const p = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
    const parts = p.split('/').filter(Boolean);
    if (parts.length < 2)
        throw new Error('Invalid object path');
    return { bucketName: parts[0], objectName: parts.slice(1).join('/') };
}
// POST /api/upload — admin only, accepts multipart file, uploads to GCS, returns /objects/... URL
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)('admin'), upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file)
        return (0, response_1.sendError)(res, 400, 'No file uploaded');
    try {
        const privateDir = getPrivateDir();
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const objectId = `${(0, crypto_1.randomUUID)()}${ext}`;
        const fullPath = `${privateDir}/uploads/${objectId}`;
        const { bucketName, objectName } = parseObjectPath(fullPath);
        const bucket = object_storage_1.objectStorageClient.bucket(bucketName);
        const gcsFile = bucket.file(objectName);
        await gcsFile.save(file.buffer, { contentType: file.mimetype, resumable: false });
        const objectPath = `/objects/uploads/${objectId}`;
        return (0, response_1.sendResponse)(res, 201, 'File uploaded', { url: objectPath, filename: file.originalname, size: file.size });
    }
    catch (err) {
        console.error('Upload error:', err);
        return (0, response_1.sendError)(res, 500, 'Failed to upload file: ' + (err.message || 'unknown error'));
    }
});
// DELETE /api/upload/:filename — no-op (object removed when DB record deleted)
router.delete('/:filename', auth_1.authenticateToken, (0, auth_1.authorizeRole)('admin'), (_req, res) => {
    return (0, response_1.sendResponse)(res, 200, 'File removed');
});
exports.default = router;
