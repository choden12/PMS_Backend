import { Router } from "express";
import { signupUser } from "../controllers/signupController";

const router = Router();

// POST /api/signup
router.post("/", signupUser);

export default router;
