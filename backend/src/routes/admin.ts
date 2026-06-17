import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

// Get dashboard stats
router.get("/stats", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const [
      totalProjects,
      totalViews,
      totalLikes,
      totalMessages,
      totalTestimonials,
      totalAwards,
      recentProjects,
      topProjects,
    ] = await Promise.all([
      db.project.count(),
      db.project.aggregate({
        _sum: { views: true },
      }),
      db.project.aggregate({
        _sum: { likes: true },
      }),
      db.message.count(),
      db.testimonial.count(),
      db.award.count(),
      db.project.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
          createdAt: true,
        },
      }),
      db.project.findMany({
        orderBy: { views: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
        },
      }),
    ]);

    const stats = {
      totalProjects,
      totalViews: totalViews._sum.views || 0,
      totalLikes: totalLikes._sum.likes || 0,
      totalMessages,
      totalTestimonials,
      totalAwards,
      recentProjects,
      topProjects,
    };

    return sendResponse(res, 200, "Stats retrieved", stats);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve stats", error);
  }
});

// Get analytics
router.get("/analytics", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { startDate, endDate, eventType } = req.query;

    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    if (eventType) {
      where.eventType = eventType;
    }

    const analytics = await db.analytics.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Group by event type
    const grouped = analytics.reduce((acc: any, item) => {
      if (!acc[item.eventType]) {
        acc[item.eventType] = 0;
      }
      acc[item.eventType]++;
      return acc;
    }, {});

    return sendResponse(res, 200, "Analytics retrieved", {
      total: analytics.length,
      grouped,
      recent: analytics,
    });
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve analytics", error);
  }
});

// Get activity logs
router.get("/activity", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const logs = await db.activityLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return sendResponse(res, 200, "Activity logs retrieved", logs);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve activity logs", error);
  }
});

export default router;
