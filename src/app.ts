import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes";
import managerRoutes from "./routes/managerRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/users", userRoutes);

export default app;
