import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../utils/auth';
import { sendResponse, sendError } from '../utils/response';

const router = Router();
const prisma = new PrismaClient();

// POST /api/feedback — public: submit feedback for a project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { projectId, name, email, rating, comment } = req.body;
    if (!projectId || !name || !email || !comment) {
      return sendError(res, 400, 'projectId, name, email, and comment are required');
    }
    const r = Math.min(5, Math.max(1, parseInt(rating) || 5));
    const feedback = await prisma.projectFeedback.create({
      data: { projectId: parseInt(projectId), name, email, rating: r, comment, status: 'pending' },
    });
    sendResponse(res, 201, 'Feedback submitted — thank you!', feedback);
  } catch (e) {
    sendError(res, 500, 'Failed to submit feedback', e);
  }
});

// GET /api/feedback/project/:id — public: approved feedback for a project
router.get('/project/:id', async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const feedback = await prisma.projectFeedback.findMany({
      where: { projectId, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, rating: true, comment: true, createdAt: true },
    });
    sendResponse(res, 200, 'Feedback fetched', feedback);
  } catch (e) {
    sendError(res, 500, 'Failed to fetch feedback', e);
  }
});

// GET /api/feedback — admin: all feedback
router.get('/', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = status ? { status: status as string } : {};
    const feedback = await prisma.projectFeedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { title: true, slug: true } } },
    });
    sendResponse(res, 200, 'Feedback fetched', feedback);
  } catch (e) {
    sendError(res, 500, 'Failed to fetch feedback', e);
  }
});

// PUT /api/feedback/:id/status — admin: approve / reject
router.put('/:id/status', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return sendError(res, 400, 'Invalid status');
    }
    const feedback = await prisma.projectFeedback.update({ where: { id }, data: { status } });
    sendResponse(res, 200, `Feedback ${status}`, feedback);
  } catch (e) {
    sendError(res, 500, 'Failed to update feedback', e);
  }
});

// DELETE /api/feedback/:id — admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.projectFeedback.delete({ where: { id } });
    sendResponse(res, 200, 'Feedback deleted');
  } catch (e) {
    sendError(res, 500, 'Failed to delete feedback', e);
  }
});

export default router;
