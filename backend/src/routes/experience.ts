import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const experience = await db.experience.findMany({ orderBy: { order: "asc" } });
    return sendResponse(res, 200, "Success", experience);
  } catch (e) {
    return sendError(res, 500, "Failed to fetch experience");
  }
});

router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { position, company, startDate, endDate, isCurrentRole, description, achievements, order } = req.body;
    if (!position || !company || !startDate) return sendError(res, 400, "Missing required fields");
    const item = await db.experience.create({
      data: {
        position, company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrentRole: isCurrentRole || false,
        description, achievements,
        order: order || 0,
      },
    });
    return sendResponse(res, 201, "Experience created", item);
  } catch (e) {
    return sendError(res, 500, "Failed to create experience");
  }
});

router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { position, company, startDate, endDate, isCurrentRole, description, achievements, order } = req.body;
    const item = await db.experience.update({
      where: { id },
      data: {
        position, company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrentRole: isCurrentRole || false,
        description, achievements, order,
      },
    });
    return sendResponse(res, 200, "Experience updated", item);
  } catch (e) {
    return sendError(res, 500, "Failed to update experience");
  }
});

router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await db.experience.delete({ where: { id: parseInt(req.params.id) } });
    return sendResponse(res, 200, "Experience deleted");
  } catch (e) {
    return sendError(res, 500, "Failed to delete experience");
  }
});

export default router;
