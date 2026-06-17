import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await db.projectCategory.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { projects: true } } },
    });
    return sendResponse(res, 200, "Success", categories);
  } catch (e) {
    return sendError(res, 500, "Failed to fetch categories");
  }
});

// POST create
router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { name, slug, description, icon, order } = req.body;
    if (!name || !slug) return sendError(res, 400, "name and slug required");
    const cat = await db.projectCategory.create({
      data: { name, slug, description, icon, order: order || 0 },
    });
    return sendResponse(res, 201, "Category created", cat);
  } catch (e: any) {
    if (e.code === "P2002") return sendError(res, 409, "Category already exists");
    return sendError(res, 500, "Failed to create category");
  }
});

// PUT update
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, description, icon, order } = req.body;
    const cat = await db.projectCategory.update({
      where: { id },
      data: { name, slug, description, icon, order },
    });
    return sendResponse(res, 200, "Category updated", cat);
  } catch (e) {
    return sendError(res, 500, "Failed to update category");
  }
});

// DELETE
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.projectCategory.delete({ where: { id } });
    return sendResponse(res, 200, "Category deleted");
  } catch (e) {
    return sendError(res, 500, "Failed to delete category");
  }
});

export default router;
