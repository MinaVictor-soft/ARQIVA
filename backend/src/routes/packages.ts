import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';

const router = Router();
const prisma = new PrismaClient();

// GET /api/packages — public
router.get('/', async (req: Request, res: Response) => {
  try {
    const where: any = { published: true };
    const packages = await prisma.package.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    sendResponse(res, 200, 'Packages fetched', packages);
  } catch (e) {
    sendError(res, 500, 'Failed to fetch packages', e);
  }
});

// GET /api/packages/all — admin (includes unpublished)
router.get('/all', authenticateToken, authorizeRole('admin'), async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
    sendResponse(res, 200, 'All packages fetched', packages);
  } catch (e) {
    sendError(res, 500, 'Failed to fetch packages', e);
  }
});

// POST /api/packages — admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const { title, description, price, currency, duration, features, includedServices, featured, published, order } = req.body;
    if (!title || price == null) return sendError(res, 400, 'Title and price are required');
    const pkg = await prisma.package.create({
      data: {
        title, description, price: parseFloat(price),
        currency: currency || 'USD', duration,
        features: features || [],
        includedServices: includedServices || [],
        featured: !!featured, published: published !== false,
        order: order || 0,
      },
    });
    sendResponse(res, 201, 'Package created', pkg);
  } catch (e) {
    sendError(res, 500, 'Failed to create package', e);
  }
});

// PUT /api/packages/:id — admin
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, price, currency, duration, features, includedServices, featured, published, order } = req.body;
    const pkg = await prisma.package.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(currency !== undefined && { currency }),
        ...(duration !== undefined && { duration }),
        ...(features !== undefined && { features }),
        ...(includedServices !== undefined && { includedServices }),
        ...(featured !== undefined && { featured: !!featured }),
        ...(published !== undefined && { published: !!published }),
        ...(order !== undefined && { order }),
      },
    });
    sendResponse(res, 200, 'Package updated', pkg);
  } catch (e) {
    sendError(res, 500, 'Failed to update package', e);
  }
});

// DELETE /api/packages/:id — admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.package.delete({ where: { id } });
    sendResponse(res, 200, 'Package deleted');
  } catch (e) {
    sendError(res, 500, 'Failed to delete package', e);
  }
});

export default router;
