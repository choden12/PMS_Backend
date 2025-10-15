import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { PrismaClient } from "@prisma/client";
import "express-async-errors";

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// =======================
// Middleware
// =======================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // React frontend URL
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies

// Log incoming requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// =======================
// Health check
// =======================
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "✅ Backend is live and ready!" });
});

// =======================
// Auth routes
// =======================
app.use("/api/auth", authRoutes);

// Handle unsupported methods for /api/auth routes
app.all("/api/auth/*", (req: Request, res: Response) => {
  res.status(405).json({ message: `Method ${req.method} not allowed on ${req.url}` });
});

// =======================
// Global error handler
// =======================
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as Error;
  console.error("❌ Server Error:", error.stack);

  res.status(500).json({
    message: error.message || "Something went wrong on the server!",
  });
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 CORS allowed for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
});

// =======================
// Graceful shutdown
// =======================
const shutdown = async () => {
  console.log("\n🛑 Shutting down server...");
  await prisma.$disconnect();
  console.log("✅ Prisma disconnected. Goodbye!");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
