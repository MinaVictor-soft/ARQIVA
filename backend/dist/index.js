"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_1 = require("./db");
const swagger_1 = require("./utils/swagger");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const services_1 = __importDefault(require("./routes/services"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const awards_1 = __importDefault(require("./routes/awards"));
const messages_1 = __importDefault(require("./routes/messages"));
const settings_1 = __importDefault(require("./routes/settings"));
const admin_1 = __importDefault(require("./routes/admin"));
const categories_1 = __importDefault(require("./routes/categories"));
const education_1 = __importDefault(require("./routes/education"));
const experience_1 = __importDefault(require("./routes/experience"));
const certifications_1 = __importDefault(require("./routes/certifications"));
const skills_1 = __importDefault(require("./routes/skills"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const packages_1 = __importDefault(require("./routes/packages"));
const feedback_1 = __importDefault(require("./routes/feedback"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const upload_1 = __importDefault(require("./routes/upload"));
const backup_1 = __importDefault(require("./routes/backup"));
const object_storage_1 = require("./replit_integrations/object_storage");
const keepalive_1 = require("./utils/keepalive");
const backup_2 = require("./utils/backup");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "3000", 10);
// Health check — MUST be before all middleware so Replit probes always get 200
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
// Root route — MUST be before middleware; serves frontend or falls back to 200 for health probe
app.get("/", (_req, res, next) => {
    const indexPath = path_1.default.join(__dirname, "../../frontend/dist/index.html");
    if (fs_1.default.existsSync(indexPath))
        return next();
    res.status(200).json({ status: "ok", service: "ARQIVA API" });
});
// Middleware
app.use((0, helmet_1.default)({
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
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (process.env.NODE_ENV === "production" ||
            origin.endsWith(".replit.app") ||
            origin.endsWith(".repl.co") ||
            origin.endsWith(".replit.dev")) {
            return callback(null, true);
        }
        const allowed = [
            process.env.FRONTEND_URL || "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:4173",
        ];
        if (allowed.includes(origin))
            return callback(null, true);
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Trust Replit's reverse proxy so rate-limiter reads the real client IP
app.set("trust proxy", 1);
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || "15") || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "2000") || 2000,
    message: "Too many requests from this IP, please try again later.",
    skip: () => process.env.NODE_ENV === "development",
    validate: { xForwardedForHeader: false },
});
app.use("/api/", limiter);
// Swagger API Docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css",
    customSiteTitle: "ARQIVA API Docs",
}));
// API Routes
app.use("/api/auth", auth_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/services", services_1.default);
app.use("/api/testimonials", testimonials_1.default);
app.use("/api/awards", awards_1.default);
app.use("/api/messages", messages_1.default);
app.use("/api/settings", settings_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/education", education_1.default);
app.use("/api/experience", experience_1.default);
app.use("/api/certifications", certifications_1.default);
app.use("/api/skills", skills_1.default);
app.use("/api/analytics", analytics_1.default);
app.use("/api/packages", packages_1.default);
app.use("/api/feedback", feedback_1.default);
app.use("/api/projects/:projectId/gallery", gallery_1.default);
app.use("/api/upload", upload_1.default);
app.use("/api/admin/backups", backup_1.default);
(0, object_storage_1.registerObjectStorageRoutes)(app);
// In production, serve React frontend and handle SPA routing
if (process.env.NODE_ENV === "production") {
    const frontendDist = path_1.default.join(__dirname, "../../frontend/dist");
    app.use(express_1.default.static(frontendDist, { maxAge: "1y", index: false }));
    app.get("*", (req, res, next) => {
        if (!req.path.startsWith("/api") && !req.path.startsWith("/api-docs") && req.path !== "/health") {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.sendFile(path_1.default.join(frontendDist, "index.html"), (err) => {
                if (err)
                    res.status(200).send("OK");
            });
        }
        else {
            next();
        }
    });
}
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { error: err }),
    });
});
// Schedule daily backup at midnight
function scheduleDailyBackup() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // next midnight
    const msUntilMidnight = midnight.getTime() - now.getTime();
    setTimeout(() => {
        (0, backup_2.runScheduledBackup)(true);
        setInterval(() => (0, backup_2.runScheduledBackup)(true), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
    console.log(`✓ Daily backup scheduled (next run in ${Math.round(msUntilMidnight / 3600000)}h)`);
}
// Start server
async function start() {
    try {
        const dbConnected = await (0, db_1.testConnection)();
        if (!dbConnected) {
            console.error("Failed to connect to database. Exiting...");
            process.exit(1);
        }
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
        });
        // Keep DB connection alive (prevents Neon idle-disconnect at ~5 min)
        (0, keepalive_1.startDbKeepalive)();
        // Schedule daily automatic backup
        scheduleDailyBackup();
        // Run an immediate startup backup in production (5s after start, non-blocking)
        if (process.env.NODE_ENV === "production") {
            setTimeout(() => (0, backup_2.runScheduledBackup)(false), 5000);
        }
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
start();
