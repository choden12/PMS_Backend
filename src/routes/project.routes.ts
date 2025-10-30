import { Router } from "express";
import { createProject, getProjects, getProjectById, getSummary } from "../controllers/project.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validate } from "../utils/validator";

const router = Router();

router.get("/", getProjects);
router.get("/summary", getSummary);
router.get("/:id", getProjectById);
router.post("/", authenticateJWT,
  [ body("title").isString().notEmpty() ],
  validate, createProject);

export default router;
