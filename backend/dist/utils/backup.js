"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDatabase = exportDatabase;
exports.saveBackupToStorage = saveBackupToStorage;
exports.listBackups = listBackups;
exports.downloadBackup = downloadBackup;
exports.restoreFromBackup = restoreFromBackup;
exports.sendBackupEmail = sendBackupEmail;
exports.runScheduledBackup = runScheduledBackup;
const db_1 = require("../db");
const object_storage_1 = require("../replit_integrations/object_storage");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require('nodemailer');
function getBucketName() {
    const dir = process.env.PRIVATE_OBJECT_DIR || '';
    if (!dir)
        throw new Error('PRIVATE_OBJECT_DIR not set');
    const parts = dir.startsWith('/') ? dir.slice(1).split('/') : dir.split('/');
    return parts[0];
}
async function exportDatabase() {
    const [users, settings, projects, projectCategories, projectImages, projectVideos, projectFiles, projectTools, services, serviceExamples, testimonials, awards, education, experience, certifications, skills, packages, messages, feedback,] = await Promise.all([
        db_1.db.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true } }),
        db_1.db.settings.findMany(),
        db_1.db.project.findMany(),
        db_1.db.projectCategory.findMany(),
        db_1.db.projectImage.findMany(),
        db_1.db.projectVideo.findMany(),
        db_1.db.projectFile.findMany(),
        db_1.db.projectTool.findMany(),
        db_1.db.service.findMany(),
        db_1.db.serviceExample.findMany(),
        db_1.db.testimonial.findMany(),
        db_1.db.award.findMany(),
        db_1.db.education.findMany(),
        db_1.db.experience.findMany(),
        db_1.db.certification.findMany(),
        db_1.db.skill.findMany(),
        db_1.db.package.findMany(),
        db_1.db.message.findMany(),
        db_1.db.projectFeedback.findMany(),
    ]);
    const data = {
        users, settings, projects, projectCategories, projectImages,
        projectVideos, projectFiles, projectTools, services, serviceExamples,
        testimonials, awards, education, experience, certifications, skills,
        packages, messages, feedback,
    };
    const rowCounts = {};
    for (const [k, v] of Object.entries(data))
        rowCounts[k] = v.length;
    return {
        data,
        meta: {
            created: new Date().toISOString(),
            tables: Object.keys(data),
            rowCounts,
        },
    };
}
async function saveBackupToStorage(label = 'auto') {
    const { data, meta } = await exportDatabase();
    const payload = JSON.stringify({ meta, data }, null, 2);
    const buf = Buffer.from(payload, 'utf8');
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-${label}-${ts}.json`;
    const bucketName = getBucketName();
    const objectName = `backups/${filename}`;
    const bucket = object_storage_1.objectStorageClient.bucket(bucketName);
    await bucket.file(objectName).save(buf, { contentType: 'application/json', resumable: false });
    console.log(`✓ Backup saved: gs://${bucketName}/${objectName} (${buf.length} bytes, ${meta.rowCounts.projects} projects)`);
    return { filename, sizeBytes: buf.length, ...meta };
}
async function listBackups() {
    const bucketName = getBucketName();
    const [files] = await object_storage_1.objectStorageClient.bucket(bucketName).getFiles({ prefix: 'backups/' });
    const metas = [];
    for (const f of files) {
        const [meta] = await f.getMetadata();
        const name = f.name.replace('backups/', '');
        if (!name.endsWith('.json') || !name.startsWith('backup-'))
            continue;
        metas.push({
            filename: name,
            created: meta.timeCreated || '',
            sizeBytes: parseInt(String(meta.size || '0'), 10),
            tables: [],
            rowCounts: {},
        });
    }
    return metas.sort((a, b) => b.created.localeCompare(a.created));
}
async function downloadBackup(filename) {
    const bucketName = getBucketName();
    const [content] = await object_storage_1.objectStorageClient.bucket(bucketName).file(`backups/${filename}`).download();
    return content;
}
async function restoreFromBackup(filename) {
    const buf = await downloadBackup(filename);
    const { data } = JSON.parse(buf.toString('utf8'));
    await db_1.db.$transaction(async (tx) => {
        // Clear in dependency order
        await tx.testimonial.deleteMany();
        await tx.projectFeedback.deleteMany();
        await tx.message.deleteMany();
        await tx.projectImage.deleteMany();
        await tx.projectVideo.deleteMany();
        await tx.projectFile.deleteMany();
        await tx.projectTool.deleteMany();
        await tx.serviceExample.deleteMany();
        await tx.project.deleteMany();
        await tx.projectCategory.deleteMany();
        await tx.service.deleteMany();
        await tx.award.deleteMany();
        await tx.education.deleteMany();
        await tx.experience.deleteMany();
        await tx.certification.deleteMany();
        await tx.skill.deleteMany();
        await tx.package.deleteMany();
        await tx.settings.deleteMany();
        // Restore each table
        if (data.settings?.length)
            await tx.settings.createMany({ data: data.settings.map((r) => ({ ...r, id: undefined })) });
        if (data.projectCategories?.length)
            await tx.projectCategory.createMany({ data: data.projectCategories });
        if (data.projects?.length)
            await tx.project.createMany({ data: data.projects.map((r) => ({ ...r, views: r.views ?? 0, likes: r.likes ?? 0, shares: r.shares ?? 0 })) });
        if (data.projectImages?.length)
            await tx.projectImage.createMany({ data: data.projectImages });
        if (data.projectVideos?.length)
            await tx.projectVideo.createMany({ data: data.projectVideos });
        if (data.projectFiles?.length)
            await tx.projectFile.createMany({ data: data.projectFiles });
        if (data.projectTools?.length)
            await tx.projectTool.createMany({ data: data.projectTools });
        if (data.services?.length)
            await tx.service.createMany({ data: data.services });
        if (data.serviceExamples?.length)
            await tx.serviceExample.createMany({ data: data.serviceExamples });
        if (data.testimonials?.length)
            await tx.testimonial.createMany({ data: data.testimonials });
        if (data.awards?.length)
            await tx.award.createMany({ data: data.awards });
        if (data.education?.length)
            await tx.education.createMany({ data: data.education });
        if (data.experience?.length)
            await tx.experience.createMany({ data: data.experience });
        if (data.certifications?.length)
            await tx.certification.createMany({ data: data.certifications });
        if (data.skills?.length)
            await tx.skill.createMany({ data: data.skills });
        if (data.packages?.length)
            await tx.package.createMany({ data: data.packages });
        if (data.messages?.length)
            await tx.message.createMany({ data: data.messages });
        if (data.projectFeedback?.length)
            await tx.projectFeedback.createMany({ data: data.projectFeedback });
    });
    const counts = {};
    for (const [k, v] of Object.entries(data))
        counts[k] = Array.isArray(v) ? v.length : 0;
    return counts;
}
function makeTransport() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass)
        return null;
    return nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
    });
}
async function sendBackupEmail(meta, backupBuffer) {
    const transport = makeTransport();
    const to = process.env.BACKUP_EMAIL;
    if (!transport || !to) {
        console.log('Email not configured — skipping backup email (set SMTP_HOST, SMTP_USER, SMTP_PASS, BACKUP_EMAIL)');
        return false;
    }
    const summary = Object.entries(meta.rowCounts).map(([k, n]) => `  ${k}: ${n} rows`).join('\n');
    const attachments = backupBuffer
        ? [{ filename: meta.filename, content: backupBuffer, contentType: 'application/json' }]
        : [];
    await transport.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `ARQIVA Backup — ${meta.created.slice(0, 10)}`,
        text: `Database backup completed.\n\nFile: ${meta.filename}\nSize: ${(meta.sizeBytes / 1024).toFixed(1)} KB\nCreated: ${meta.created}\n\nRow counts:\n${summary}\n\nThe backup is attached to this email and also stored in Replit Object Storage under backups/.`,
        attachments,
    });
    console.log(`✓ Backup email sent to ${to}`);
    return true;
}
async function runScheduledBackup(sendEmail = true) {
    try {
        console.log('[Backup] Starting scheduled backup...');
        const meta = await saveBackupToStorage('daily');
        if (sendEmail) {
            try {
                const buf = await downloadBackup(meta.filename);
                await sendBackupEmail(meta, buf);
            }
            catch (emailErr) {
                console.warn('[Backup] Email failed (backup still saved):', emailErr.message);
            }
        }
        console.log(`[Backup] Done — ${meta.rowCounts.projects} projects, ${meta.rowCounts.projectImages} images`);
    }
    catch (err) {
        console.error('[Backup] Scheduled backup failed:', err.message);
    }
}
