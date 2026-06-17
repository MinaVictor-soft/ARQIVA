import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const skills = await db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
    return sendResponse(res, 200, "Success", skills);
  } catch (e) {
    return sendError(res, 500, "Failed to fetch skills");
  }
});

router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { name, category, proficiency, order } = req.body;
    if (!name || !category) return sendError(res, 400, "name and category required");
    const item = await db.skill.create({
      data: { name, category, proficiency: proficiency || "intermediate", order: order || 0 },
    });
    return sendResponse(res, 201, "Skill created", item);
  } catch (e: any) {
    if (e.code === "P2002") return sendError(res, 409, "Skill already exists");
    return sendError(res, 500, "Failed to create skill");
  }
});

router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, proficiency, order } = req.body;
    const item = await db.skill.update({
      where: { id },
      data: { name, category, proficiency, order },
    });
    return sendResponse(res, 200, "Skill updated", item);
  } catch (e) {
    return sendError(res, 500, "Failed to update skill");
  }
});

router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await db.skill.delete({ where: { id: parseInt(req.params.id) } });
    return sendResponse(res, 200, "Skill deleted");
  } catch (e) {
    return sendError(res, 500, "Failed to delete skill");
  }
});

export default router;
