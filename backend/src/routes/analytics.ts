import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

// Track analytics event (public)
router.post("/track", async (req, res) => {
  try {
    const { eventType, projectId, pageUrl, referrer, metadata } = req.body;
    if (!eventType) return sendError(res, 400, "eventType required");
    const userAgent = (req.headers["user-agent"] as string) || undefined;
    const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
    const ipAddress = rawIp.split(",")[0].trim() || undefined;
    await db.analytics.create({
      data: { eventType, projectId: projectId ? parseInt(projectId) : null, pageUrl, referrer, metadata, userAgent, ipAddress },
    });
    return sendResponse(res, 200, "Tracked");
  } catch (e) {
    return sendError(res, 500, "Failed to track");
  }
});

// Dashboard analytics (admin only)
router.get("/dashboard", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const [
      totalPageViews,
      totalProjectViews,
      contactRequests,
      topProjects,
      recentActivity,
      monthlyViews,
    ] = await Promise.all([
      db.analytics.count({ where: { eventType: "page_view" } }),
      db.analytics.count({ where: { eventType: "project_view" } }),
      db.contactRequest.count(),
      db.project.findMany({ orderBy: { views: "desc" }, take: 5, select: { id: true, title: true, slug: true, views: true, likes: true } }),
      db.analytics.findMany({ orderBy: { createdAt: "desc" }, take: 20, select: { eventType: true, pageUrl: true, createdAt: true } }),
      db.analytics.groupBy({
        by: ["eventType"],
        _count: { id: true },
      }),
    ]);

    return sendResponse(res, 200, "Success", {
      totalPageViews,
      totalProjectViews,
      contactRequests,
      topProjects,
      recentActivity,
      monthlyViews,
    });
  } catch (e) {
    return sendError(res, 500, "Failed to fetch analytics");
  }
});

export default router;
