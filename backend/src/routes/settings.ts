import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";
import { updateSettingsSchema } from "../utils/validation";
import { CustomRequest } from "../utils/types";

const router = Router();

// Get settings (public)
router.get("/", async (req, res) => {
  try {
    const settings = await db.settings.findFirst();

    if (!settings) {
      return sendError(res, 404, "Settings not found");
    }

    return sendResponse(res, 200, "Settings retrieved", settings);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve settings", error);
  }
});

// Update settings (admin only)
router.put("/", authenticateToken, authorizeRole("admin"), async (req: CustomRequest, res) => {
  try {
    const validated = updateSettingsSchema.parse(req.body);

    const settings = await db.settings.update({
      where: { id: 1 },
      data: {
        ...validated,
        updatedAt: new Date(),
      },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        userId: req.user?.id,
        action: "UPDATE_SETTINGS",
        entityType: "Settings",
        changes: validated,
      },
    });

    return sendResponse(res, 200, "Settings updated", settings);
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    if (error.code === "P2025") {
      return sendError(res, 404, "Settings not found");
    }
    return sendError(res, 500, "Failed to update settings", error);
  }
});

export default router;
