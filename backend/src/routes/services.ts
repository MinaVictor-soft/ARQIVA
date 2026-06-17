import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError, getPaginationParams, sendPaginatedResponse } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";
import { createServiceSchema, updateServiceSchema } from "../utils/validation";
import { CustomRequest } from "../utils/types";

const router = Router();

// Get all services (public)
router.get("/", async (req, res) => {
  try {
    const services = await db.service.findMany({
      include: {
        examples: {
          include: { project: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return sendResponse(res, 200, "Services retrieved", services);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve services", error);
  }
});

// Get service by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await db.service.findUnique({
      where: { slug },
      include: {
        examples: {
          include: { project: true },
        },
      },
    });

    if (!service) {
      return sendError(res, 404, "Service not found");
    }

    return sendResponse(res, 200, "Service retrieved", service);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve service", error);
  }
});

// Create service (admin only)
router.post("/", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const validated = createServiceSchema.parse(req.body);

    const service = await db.service.create({
      data: validated,
      include: { examples: true },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "CREATE_SERVICE",
        entityType: "Service",
        entityId: service.id,
      },
    });

    return sendResponse(res, 201, "Service created", service);
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to create service", error);
  }
});

// Update service (admin only)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;
    const validated = updateServiceSchema.parse(req.body);

    const service = await db.service.update({
      where: { id: parseInt(id) },
      data: validated,
      include: { examples: true },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "UPDATE_SERVICE",
        entityType: "Service",
        entityId: service.id,
      },
    });

    return sendResponse(res, 200, "Service updated", service);
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Service not found");
    }
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to update service", error);
  }
});

// Delete service (admin only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;

    await db.service.delete({
      where: { id: parseInt(id) },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "DELETE_SERVICE",
        entityType: "Service",
        entityId: parseInt(id),
      },
    });

    return sendResponse(res, 200, "Service deleted");
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Service not found");
    }
    return sendError(res, 500, "Failed to delete service", error);
  }
});

export default router;
