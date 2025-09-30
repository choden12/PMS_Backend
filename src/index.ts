import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { PrismaClient } from "@prisma/client";
import "express-async-errors";

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Log incoming requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);

// Handle unsupported methods for /api/auth routes
app.all("/api/auth/*", (req: Request, res: Response) => {
  res.status(405).json({ error: `Method ${req.method} not allowed on ${req.url}` });
});

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("✅ Backend is live!");
});

// Global error handler 
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running at http://localhost:${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});

// Graceful shutdown
const shutdown = async () => {
  console.log("\n🛑 Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
