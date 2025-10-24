import { Router } from "express"
import {
  getAllSelectionProjects,
  getSelectionProjectById,
  createSelectionProject,
  updateSelectionProject,
  deleteSelectionProject,
} from "../controllers/selectionProjectController"
import { upload } from "../config/multer"
import { authenticate } from "../middleware/auth"

const router = Router()

router.get("/", authenticate, getAllSelectionProjects)
router.get("/:id", authenticate, getSelectionProjectById)
router.post("/", authenticate, upload.single("pdf"), createSelectionProject)
router.put("/:id", authenticate, upload.single("pdf"), updateSelectionProject)
router.delete("/:id", authenticate, deleteSelectionProject)

export default router
