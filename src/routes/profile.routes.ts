import { Router } from "express";
import { getMyProfile, updateMyProfile, getProfiles } from "../controllers/profile.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validate } from "../utils/validator";

const router = Router();

router.get("/", getProfiles);
router.get("/me", authenticateJWT, getMyProfile);
router.put("/me", authenticateJWT,
  [ body("name").optional().isString(), body("skills").optional().isArray() ],
  validate, updateMyProfile);

export default router;
