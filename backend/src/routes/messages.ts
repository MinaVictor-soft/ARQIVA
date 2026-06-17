import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError, getPaginationParams, sendPaginatedResponse } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";
import { createMessageSchema, createContactRequestSchema } from "../utils/validation";

const router = Router();

// Submit contact message (public)
router.post("/", async (req, res) => {
  try {
    const validated = createMessageSchema.parse(req.body);

    const message = await db.message.create({
      data: validated,
    });

    // Track in analytics
    await db.analytics.create({
      data: {
        eventType: "CONTACT_FORM_SUBMITTED",
        metadata: {
          messageId: message.id,
          email: message.email,
        },
      },
    });

    return sendResponse(res, 201, "Message sent successfully", { id: message.id });
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Failed to send message", error);
  }
});

// Get all messages (admin only)
router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { skip, take, page } = getPaginationParams(req.query);
    const { read } = req.query;

    const where: any = {};
    if (read === "true") {
      where.read = true;
    } else if (read === "false") {
      where.read = false;
    }

    const [messages, total] = await Promise.all([
      db.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.message.count({ where }),
    ]);

    return sendPaginatedResponse(res, messages, total, page, take, "Messages retrieved");
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve messages", error);
  }
});

// Get message by ID (admin only)
router.get("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const message = await db.message.findUnique({
      where: { id: parseInt(id) },
    });

    if (!message) {
      return sendError(res, 404, "Message not found");
    }

    // Mark as read
    if (!message.read) {
      await db.message.update({
        where: { id: parseInt(id) },
        data: { read: true },
      });
    }

    return sendResponse(res, 200, "Message retrieved", message);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve message", error);
  }
});

// Delete message (admin only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    await db.message.delete({
      where: { id: parseInt(id) },
    });

    return sendResponse(res, 200, "Message deleted");
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Message not found");
    }
    return sendError(res, 500, "Failed to delete message", error);
  }
});

// Mark as replied
router.patch("/:id/replied", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const message = await db.message.update({
      where: { id: parseInt(id) },
      data: { replied: true },
    });

    return sendResponse(res, 200, "Message marked as replied", message);
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, 404, "Message not found");
    }
    return sendError(res, 500, "Failed to update message", error);
  }
});

export default router;
