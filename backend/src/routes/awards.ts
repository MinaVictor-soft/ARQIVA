import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError, getPaginationParams, sendPaginatedResponse } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";
import { createAwardSchema, updateAwardSchema } from "../utils/validation";
import { CustomRequest } from "../utils/types";

const router = Router();

// Get all awards (public)
router.get("/", async (req, res) => {
  try {
    const { skip, take, page } = getPaginationParams(req.query);
    const { featured, year } = req.query;

    const where: any = {};
    if (featured === "true") {
      where.featured = true;
    }
    if (year) {
      where.year = parseInt(year as string);
    }

    const [awards, total] = await Promise.all([
      db.award.findMany({
        where,
        orderBy: { year: "desc" },
        skip,
        take,
      }),
      db.award.count({ where }),
    ]);

    return sendPaginatedResponse(res, awards, total, page, take, "Awards retrieved");
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve awards", error);
  }
});

// Get award by ID (admin)
router.get("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const award = await db.award.findUnique({
      where: { id: parseInt(id) },
    });

    if (!award) {
      return sendError(res, 404, "Award not found");
    }

    return sendResponse(res, 200, "Award retrieved", award);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve award", error);
  }
});

// Create award (admin only)
router.post("/", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const validated = createAwardSchema.parse(req.body);

    const award = await db.award.create({
      data: validated,
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "CREATE_AWARD",
        entityType: "Award",
        entityId: award.id,
      },
    });

    return sendResponse(res, 201, "Award created", award);
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to create award", error);
  }
});

// Update award (admin only)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;
    const validated = updateAwardSchema.parse(req.body);

    const award = await db.award.update({
      where: { id: parseInt(id) },
      data: validated,
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "UPDATE_AWARD",
        entityType: "Award",
        entityId: award.id,
      },
    });

    return sendResponse(res, 200, "Award updated", award);
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Award not found");
    }
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to update award", error);
  }
});

// Delete award (admin only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const { id } = req.params;

    await db.award.delete({
      where: { id: parseInt(id) },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "DELETE_AWARD",
        entityType: "Award",
        entityId: parseInt(id),
      },
    });

    return sendResponse(res, 200, "Award deleted");
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Award not found");
    }
    return sendError(res, 500, "Failed to delete award", error);
  }
});

export default router;
