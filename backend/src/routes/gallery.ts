import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';

const router = Router({ mergeParams: true });
const prisma = new PrismaClient();

// GET /api/projects/:projectId/gallery
router.get('/', async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const images = await prisma.projectImage.findMany({
      where: { projectId },
      orderBy: [{ galleryName: 'asc' }, { order: 'asc' }],
    });
    sendResponse(res, 200, 'Gallery fetched', images);
  } catch (e) {
    sendError(res, 500, 'Failed to fetch gallery', e);
  }
});

// POST /api/projects/:projectId/gallery — admin: add image(s)
router.post('/', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const { imageUrl, caption, altText, galleryName, order } = req.body;
    if (!imageUrl) return sendError(res, 400, 'imageUrl is required');
    const image = await prisma.projectImage.create({
      data: {
        projectId, imageUrl, caption, altText,
        galleryName: galleryName || 'main',
        order: order || 0,
      },
    });
    sendResponse(res, 201, 'Image added', image);
  } catch (e) {
    sendError(res, 500, 'Failed to add image', e);
  }
});

// PUT /api/projects/:projectId/gallery/:id — admin: update image
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { caption, altText, galleryName, order } = req.body;
    const image = await prisma.projectImage.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(altText !== undefined && { altText }),
        ...(galleryName !== undefined && { galleryName }),
        ...(order !== undefined && { order }),
      },
    });
    sendResponse(res, 200, 'Image updated', image);
  } catch (e) {
    sendError(res, 500, 'Failed to update image', e);
  }
});

// DELETE /api/projects/:projectId/gallery/:id — admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.projectImage.delete({ where: { id } });
    sendResponse(res, 200, 'Image deleted');
  } catch (e) {
    sendError(res, 500, 'Failed to delete image', e);
  }
});

// PUT /api/projects/:projectId/gallery/reorder — admin
router.put('/reorder/bulk', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) return sendError(res, 400, 'items array required');
    await Promise.all(items.map((item: { id: number; order: number }) =>
      prisma.projectImage.update({ where: { id: item.id }, data: { order: item.order } })
    ));
    sendResponse(res, 200, 'Gallery reordered');
  } catch (e) {
    sendError(res, 500, 'Failed to reorder gallery', e);
  }
});

export default router;
