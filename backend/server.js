import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "./src/config/cloudinary.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import UserRouter from "./src/routers/UserRouter.js"
import aiRoutes from "./src/routers/aiRouter.js"


// Import all schema routes
import workoutRoutes from "./src/routers/workout.routes.js";
import nutritionRoutes from "./src/routers/nutrition.routes.js";
import progressRoutes from "./src/routers/progress.routes.js";
import analyticsRoutes from "./src/routers/analytics.routes.js";
import goalrouter from "./src/routers/goalrouter.js";

const app = express();

// Middleware
app.use(cors({ 
    origin: ["http://localhost:5173", "http://localhost:3000"], 
    credentials: true 
}));
app.use(express.json({ limit: "10mb" })); // Increased limit for photos
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// ==================== ROUTES ====================

// Auth Routes
app.use("/auth", AuthRouter);

// User Routes (profile, health data, goals)
app.use("/user", UserRouter);
app.use("/api/v1/ai", aiRoutes)

// AI Routes
// app.use("/api/v1/ai", aiRoutes);

// ==================== SCHEMA ROUTES ====================

// Workout Routes
app.use("/api/workouts", workoutRoutes);

// Nutrition Routes
app.use("/api/nutrition", nutritionRoutes);

// Progress Routes
app.use("/api/progress", progressRoutes);

// Analytics Routes
app.use("/api/analytics", analyticsRoutes);

app.use("/api/user", goalrouter);

// ==================== TEST ROUTE ====================
app.get("/", (req, res) => {
    console.log("Server is Working");
    res.status(200).json({ 
        message: "Health Nexus API Server is Working",
        version: "1.0.0",
        endpoints: {
            auth: "/auth",
            user: "/user",
            ai: "/api/v1/ai",
            workouts: "/api/workouts",
            nutrition: "/api/nutrition",
            progress: "/api/progress",
            analytics: "/api/analytics"
        }
    });
});

// ==================== HEALTH CHECK ROUTE ====================
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        services: {
            database: "connected",
            cloudinary: "connected"
        }
    });
});

// ==================== ERROR HANDLING ====================

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        message: "Route not found",
        path: req.originalUrl 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    const errorMessage = err.message || "Internal Server Error";
    const statusCode = err.statusCode || 500;
    
    console.error("Error Found:", {
        message: errorMessage,
        statusCode,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    res.status(statusCode).json({ 
        message: errorMessage,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

// ==================== SERVER START ====================
const port = process.env.PORT || 5000;

app.listen(port, async () => {
    console.log("🚀 Server started at port:", port);
    console.log(`📡 API available at: http://localhost:${port}`);
    
    try {
        await connectDB();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }

    try {
        const res = await cloudinary.api.ping();
        console.log("✅ Cloudinary API is working", res);
    } catch (error) {
        console.error("❌ Error Connecting Cloudinary API", error);
    }
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on("SIGINT", async () => {
    console.log("\n🛑 Server shutting down...");
    process.exit(0);
});

process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled Rejection:", error);
});

export default app;