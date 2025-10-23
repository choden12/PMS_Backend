import express from "express";
import {
  getProjects,
  addProject,
  updateProject,
  endProject,
} from "../controllers/projectController";

const router = express.Router();

router.get("/", getProjects);
router.post("/", addProject);
router.put("/:id", updateProject);
router.put("/:id/end", endProject); // ✅ Mark project as completed

export default router;
