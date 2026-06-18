import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
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
import uploadRoutes from "./routes/upload";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Health check — MUST be before all middleware so Replit probes always get 200
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root route — MUST be before middleware; serves frontend or falls back to 200 for health probe
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
  if (fs.existsSync(indexPath)) return next();
  res.status(200).json({ status: "ok", service: "ARQIVA API" });
});

// Middleware
app.use(
  helmet({
    frameguard: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://replit.com", "https://*.replit.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
        connectSrc: ["'self'", "https:", "wss:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "https:"],
      },
    },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV === "production" ||
        origin.endsWith(".replit.app") ||
        origin.endsWith(".repl.co") ||
        origin.endsWith(".replit.dev")
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

// Trust Replit's reverse proxy so rate-limiter reads the real client IP
app.set("trust proxy", 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || "15") || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "2000") || 2000,
  message: "Too many requests from this IP, please try again later.",
  skip: () => process.env.NODE_ENV === "development",
  validate: { xForwardedForHeader: false },
});

app.use("/api/", limiter);

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
app.use("/api/upload", uploadRoutes);

// Serve uploaded files as static assets
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// In production, serve React frontend and handle SPA routing
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist, { maxAge: "1y", index: false }));
  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/api-docs") && req.path !== "/health") {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(frontendDist, "index.html"), (err) => {
        if (err) res.status(200).send("OK");
      });
    } else {
      next();
    }
  });
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
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
