import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { testConnection } from "./db";
import { swaggerSpec } from "./utils/swagger";

// Import routes
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import serviceRoutes from "./routes/services";
import testimonialRoutes from "./routes/testimonials";
import awardRoutes from "./routes/awards";
import messageRoutes from "./routes/messages";
import settingsRoutes from "./routes/settings";
import adminRoutes from "./routes/admin";
import categoriesRoutes from "./routes/categories";
import educationRoutes from "./routes/education";
import experienceRoutes from "./routes/experience";
import certificationsRoutes from "./routes/certifications";
import skillsRoutes from "./routes/skills";
import analyticsRoutes from "./routes/analytics";
import packagesRoutes from "./routes/packages";
import feedbackRoutes from "./routes/feedback";
import galleryRoutes from "./routes/gallery";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // In production, same-origin requests have no Origin header — always allow
      if (!origin) return callback(null, true);
      // Allow Replit deployment domains
      if (
        process.env.NODE_ENV === "production" ||
        origin.endsWith(".replit.app") ||
        origin.endsWith(".repl.co") ||
        origin.endsWith(".janeway.replit.dev")
      ) {
        return callback(null, true);
      }
      const allowed = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:4173",
      ];
      if (allowed.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || "15") || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "2000") || 2000,
  message: "Too many requests from this IP, please try again later.",
  skip: () => process.env.NODE_ENV === "development",
});

app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Swagger API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css",
  customSiteTitle: "ARQIVA API Docs",
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/awards", awardRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/projects/:projectId/gallery", galleryRoutes);

// In production, serve React frontend and handle SPA routing
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (req: Request, res: Response) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith("/api") && !req.path.startsWith("/api-docs") && req.path !== "/health") {
      res.sendFile(path.join(frontendDist, "index.html"));
    }
  });
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err }),
  });
});

// Start server
async function start() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Failed to connect to database. Exiting...");
      process.exit(1);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
