import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError, getPaginationParams, sendPaginatedResponse } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";
import { createTestimonialSchema, updateTestimonialSchema } from "../utils/validation";
import { CustomRequest } from "../utils/types";

const router = Router();

// Get all testimonials (public)
router.get("/", async (req, res) => {
  try {
    const { featured } = req.query;

    const where: any = {};
    if (featured === "true") {
      where.featured = true;
    }

    const testimonials = await db.testimonial.findMany({
      where,
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });

    return sendResponse(res, 200, "Testimonials retrieved", testimonials);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve testimonials", error);
  }
});

// Get testimonial by ID (admin)
router.get("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await db.testimonial.findUnique({
      where: { id: parseInt(id) },
      include: { project: true },
    });

    if (!testimonial) {
      return sendError(res, 404, "Testimonial not found");
    }

    return sendResponse(res, 200, "Testimonial retrieved", testimonial);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve testimonial", error);
  }
});

// Create testimonial (admin only)
router.post("/", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const validated = createTestimonialSchema.parse(req.body);

    const testimonial = await db.testimonial.create({
      data: validated,
      include: { project: true },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "CREATE_TESTIMONIAL",
        entityType: "Testimonial",
        entityId: testimonial.id,
      },
    });

    return sendResponse(res, 201, "Testimonial created", testimonial);
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to create testimonial", error);
  }
});

// Update testimonial (admin only)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;
    const validated = updateTestimonialSchema.parse(req.body);

    const testimonial = await db.testimonial.update({
      where: { id: parseInt(id) },
      data: validated,
      include: { project: true },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "UPDATE_TESTIMONIAL",
        entityType: "Testimonial",
        entityId: testimonial.id,
      },
    });

    return sendResponse(res, 200, "Testimonial updated", testimonial);
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Testimonial not found");
    }
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to update testimonial", error);
  }
});

// Delete testimonial (admin only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;

    await db.testimonial.delete({
      where: { id: parseInt(id) },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "DELETE_TESTIMONIAL",
        entityType: "Testimonial",
        entityId: parseInt(id),
      },
    });

    return sendResponse(res, 200, "Testimonial deleted");
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Testimonial not found");
    }
    return sendError(res, 500, "Failed to delete testimonial", error);
  }
});

export default router;
