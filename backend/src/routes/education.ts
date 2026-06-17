import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const education = await db.education.findMany({ orderBy: { order: "asc" } });
    return sendResponse(res, 200, "Success", education);
  } catch (e) {
    return sendError(res, 500, "Failed to fetch education");
  }
});

router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { degree, field, institution, startYear, endYear, description, order } = req.body;
    if (!degree || !field || !institution || !startYear) return sendError(res, 400, "Missing required fields");
    const item = await db.education.create({
      data: { degree, field, institution, startYear: parseInt(startYear), endYear: endYear ? parseInt(endYear) : null, description, order: order || 0 },
    });
    return sendResponse(res, 201, "Education created", item);
  } catch (e) {
    return sendError(res, 500, "Failed to create education");
  }
});

router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { degree, field, institution, startYear, endYear, description, order } = req.body;
    const item = await db.education.update({
      where: { id },
      data: { degree, field, institution, startYear: parseInt(startYear), endYear: endYear ? parseInt(endYear) : null, description, order },
    });
    return sendResponse(res, 200, "Education updated", item);
  } catch (e) {
    return sendError(res, 500, "Failed to update education");
  }
});

router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await db.education.delete({ where: { id: parseInt(req.params.id) } });
    return sendResponse(res, 200, "Education deleted");
  } catch (e) {
    return sendError(res, 500, "Failed to delete education");
  }
});

export default router;
