import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import profilesRoutes from "./routes/profile.routes";
import projectsRoutes from "./routes/project.routes";
import tasksRoutes from "./routes/task.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "PMS Backend API" }));

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);

app.use(errorHandler);

export default app;
