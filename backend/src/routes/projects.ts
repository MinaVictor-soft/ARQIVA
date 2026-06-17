import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError, getPaginationParams, sendPaginatedResponse } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";
import { createProjectSchema, updateProjectSchema } from "../utils/validation";
import { CustomRequest } from "../utils/types";

const router = Router();

// Get all projects (public)
router.get("/", async (req, res) => {
  try {
    const { skip, take, page } = getPaginationParams(req.query);
    const { category, featured, year } = req.query;

    const where: any = { published: true };

    if (category) {
      where.category = { slug: category };
    }
    if (featured === "true") {
      where.featured = true;
    }
    if (year) {
      where.year = parseInt(year as string);
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          category: true,
          images: { take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.project.count({ where }),
    ]);

    return sendPaginatedResponse(res, projects, total, page, take, "Projects retrieved");
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve projects", error);
  }
});

// Get project by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await db.project.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        videos: { orderBy: { order: "asc" } },
        files: true,
        tools: true,
        testimonials: true,
        comments: { where: { approved: true } },
      },
    });

    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    return sendResponse(res, 200, "Project retrieved", project);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve project", error);
  }
});

// Track a single view — deduplicated by IP per 24h window
const viewCache = new Map<string, number>(); // key: `${ip}:${projectId}`
router.post("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id);
    if (isNaN(projectId)) return sendError(res, 400, "Invalid project id");

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const cacheKey = `${ip}:${projectId}`;
    const lastView = viewCache.get(cacheKey);
    const now = Date.now();

    // Only count once per IP per project per 24h
    if (lastView && now - lastView < 24 * 60 * 60 * 1000) {
      return sendResponse(res, 200, "Already counted", {});
    }

    viewCache.set(cacheKey, now);
    // Prune stale entries every 1000 calls
    if (viewCache.size > 10000) {
      const cutoff = now - 24 * 60 * 60 * 1000;
      for (const [k, t] of viewCache) { if (t < cutoff) viewCache.delete(k); }
    }

    await db.project.update({
      where: { id: projectId },
      data: { views: { increment: 1 } },
    });
    return sendResponse(res, 200, "View tracked", {});
  } catch (error: any) {
    if (error.code === "P2025") return sendError(res, 404, "Project not found");
    return sendError(res, 500, "Failed to track view", error);
  }
});

// Create project (admin only)
router.post("/", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const validated = createProjectSchema.parse(req.body);

    const project = await db.project.create({
      data: validated,
      include: { category: true },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "CREATE_PROJECT",
        entityType: "Project",
        entityId: project.id,
      },
    });

    return sendResponse(res, 201, "Project created", project);
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to create project", error);
  }
});

// Update project (admin only)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;
    const validated = updateProjectSchema.parse(req.body);

    const project = await db.project.update({
      where: { id: parseInt(id) },
      data: validated,
      include: { category: true },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "UPDATE_PROJECT",
        entityType: "Project",
        entityId: project.id,
        changes: validated,
      },
    });

    return sendResponse(res, 200, "Project updated", project);
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Project not found");
    }
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to update project", error);
  }
});

// Delete project (admin only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;

    await db.project.delete({
      where: { id: parseInt(id) },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "DELETE_PROJECT",
        entityType: "Project",
        entityId: parseInt(id),
      },
    });

    return sendResponse(res, 200, "Project deleted");
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Project not found");
    }
    return sendError(res, 500, "Failed to delete project", error);
  }
});

// Add project image
router.post("/:projectId/images", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { projectId } = req.params;
    const { imageUrl, caption, order } = req.body;

    const image = await db.projectImage.create({
      data: {
        projectId: parseInt(projectId),
        imageUrl,
        caption,
        order: order || 0,
      },
    });

    return sendResponse(res, 201, "Image added", image);
  } catch (error: any) {
    if (error.code === "P2003") {
      return sendError(res, 404, "Project not found");
    }
    return sendError(res, 500, "Failed to add image", error);
  }
});

// Get project images
router.get("/:projectId/images", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { projectId } = req.params;
    const images = await db.projectImage.findMany({
      where: { projectId: parseInt(projectId) },
      orderBy: { order: "asc" },
    });
    return sendResponse(res, 200, "OK", images);
  } catch (error: any) {
    return sendError(res, 500, "Failed to fetch images", error);
  }
});

// Update project image (order, caption)
router.patch("/:projectId/images/:imageId", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { imageId } = req.params;
    const { order, caption } = req.body;
    const updated = await db.projectImage.update({
      where: { id: parseInt(imageId) },
      data: { ...(order !== undefined && { order }), ...(caption !== undefined && { caption }) },
    });
    return sendResponse(res, 200, "Updated", updated);
  } catch (error: any) {
    return sendError(res, 500, "Failed to update image", error);
  }
});

// Delete project image
router.delete("/:projectId/images/:imageId", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { imageId } = req.params;
    await db.projectImage.delete({ where: { id: parseInt(imageId) } });
    return sendResponse(res, 200, "Image deleted", null);
  } catch (error: any) {
    if (error.code === "P2025") return sendError(res, 404, "Image not found");
    return sendError(res, 500, "Failed to delete image", error);
  }
});

// Like project
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await db.project.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    });

    return sendResponse(res, 200, "Project liked", { likes: project.likes });
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Project not found");
    }
    return sendError(res, 500, "Failed to like project", error);
  }
});

// Unlike project (decrement)
router.post("/:id/unlike", async (req, res) => {
  try {
    const { id } = req.params;
    const current = await db.project.findUnique({ where: { id: parseInt(id) }, select: { likes: true } });
    const project = await db.project.update({
      where: { id: parseInt(id) },
      data: { likes: { decrement: current && current.likes > 0 ? 1 : 0 } },
    });
    return sendResponse(res, 200, "Project unliked", { likes: project.likes });
  } catch (error: any) {
    if (error.code === "P2025") return sendError(res, 404, "Project not found");
    return sendError(res, 500, "Failed to unlike project", error);
  }
});

// Share project (increment counter)
router.post("/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.project.update({
      where: { id: parseInt(id) },
      data: { shares: { increment: 1 } },
    });
    return sendResponse(res, 200, "Share tracked", { shares: project.shares });
  } catch (error: any) {
    if (error.code === "P2025") return sendError(res, 404, "Project not found");
    return sendError(res, 500, "Failed to track share", error);
  }
});

export default router;
