import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import projectRoutes from "./routes/projectRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 500;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
app.get("/", (_req, res) => {
  res.send("welcome!"); // quick test route
});
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ===== Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
