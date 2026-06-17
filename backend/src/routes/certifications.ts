import { Router } from "express";
import { db } from "../db";
import { sendResponse, sendError } from "../utils/response";
import { authenticateToken, authorizeRole } from "../utils/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await db.certification.findMany({ orderBy: { order: "asc" } });
    return sendResponse(res, 200, "Success", items);
  } catch (e) {
    return sendError(res, 500, "Failed to fetch certifications");
  }
});

router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { name, issuer, issuedDate, expiryDate, credentialUrl, order } = req.body;
    if (!name || !issuer || !issuedDate) return sendError(res, 400, "Missing required fields");
    const item = await db.certification.create({
      data: {
        name, issuer,
        issuedDate: new Date(issuedDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialUrl, order: order || 0,
      },
    });
    return sendResponse(res, 201, "Certification created", item);
  } catch (e) {
    return sendError(res, 500, "Failed to create certification");
  }
});

router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, issuer, issuedDate, expiryDate, credentialUrl, order } = req.body;
    const item = await db.certification.update({
      where: { id },
      data: {
        name, issuer,
        issuedDate: new Date(issuedDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialUrl, order,
      },
    });
    return sendResponse(res, 200, "Certification updated", item);
  } catch (e) {
    return sendError(res, 500, "Failed to update certification");
  }
});

router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await db.certification.delete({ where: { id: parseInt(req.params.id) } });
    return sendResponse(res, 200, "Certification deleted");
  } catch (e) {
    return sendError(res, 500, "Failed to delete certification");
  }
});

export default router;
