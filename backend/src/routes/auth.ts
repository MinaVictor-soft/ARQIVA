import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { generateTokens, verifyRefreshToken } from "../utils/auth";
import { sendResponse, sendError } from "../utils/response";
import { loginSchema, registerSchema, refreshTokenSchema } from "../utils/validation";
import { CustomRequest } from "../utils/types";

const router = Router();

// Login
router.post("/login", async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(validated.password, user.password);
    if (!passwordMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    if (!user.isActive) {
      return sendError(res, 403, "User account is inactive");
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return sendResponse(res, 200, "Login successful", {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Login failed", error);
  }
});

// Register (Admin only - for creating new admin accounts)
router.post("/register", async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return sendError(res, 409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = await db.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        firstName: validated.firstName,
        lastName: validated.lastName,
        role: "user",
        isActive: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return sendResponse(res, 201, "Registration successful", {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    if (error.errors) {
      return sendError(res, 400, "Validation error", error.errors);
    }
    return sendError(res, 500, "Registration failed", error);
  }
});

// Refresh Token
router.post("/refresh", (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 400, "Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return sendError(res, 403, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, "Token refreshed", {
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return sendError(res, 500, "Token refresh failed", error);
  }
});

// Logout
router.post("/logout", (req: CustomRequest, res) => {
  res.clearCookie("refreshToken");
  return sendResponse(res, 200, "Logout successful");
});

// Get current user
router.get("/me", async (req: CustomRequest, res) => {
  try {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendResponse(res, 200, "User retrieved", user);
  } catch (error) {
    return sendError(res, 500, "Failed to retrieve user", error);
  }
});

export default router;
