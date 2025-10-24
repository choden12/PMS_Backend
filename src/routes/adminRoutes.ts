import { Router } from "express"
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from "../controllers/adminController"
import { authenticate } from "../middleware/auth"

const router = Router()

router.get("/", authenticate, getAllAdmins)
router.get("/:id", authenticate, getAdminById)
router.post("/", authenticate, createAdmin)
router.put("/:id", authenticate, updateAdmin)
router.delete("/:id", authenticate, deleteAdmin)

export default router
