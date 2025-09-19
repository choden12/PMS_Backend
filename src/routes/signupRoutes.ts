import { Router } from "express";
import { signupUser, getAllUsers } from "../controllers/signupController";

const router = Router();

router.post("/signup", signupUser);  // create user
router.get("/signup", getAllUsers);  // fetch all users

export default router;
