import { Router } from "express"
import {
  getAllSelectionProjects,
  getSelectionProjectById,
  createSelectionProject,
  updateSelectionProject,
  deleteSelectionProject,
} from "../controllers/selectionProjectController"
import { upload } from "../config/multer"

const router = Router()

router.get("/", getAllSelectionProjects)
router.get("/:id", getSelectionProjectById)
router.post("/", upload.single("pdf"), createSelectionProject)
router.put("/:id", upload.single("pdf"), updateSelectionProject)
router.delete("/:id", deleteSelectionProject)

export default router
