import { Router } from "express"
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from "../controllers/projectController"

const router = Router()

router.get("/stats", getProjectStats)
router.get("/", getAllProjects)
router.get("/:id", getProjectById)
router.post("/", createProject)
router.put("/:id", updateProject)
router.delete("/:id", deleteProject)

export default router
