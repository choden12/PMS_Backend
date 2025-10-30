import { Router } from "express";
import { createTask, getTasks, getTaskById, updateTask } from "../controllers/task.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validate } from "../utils/validator";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", authenticateJWT,
  [ body("title").isString().notEmpty(), body("projectId").isString().notEmpty() ],
  validate, createTask);

router.put("/:id", authenticateJWT, updateTask);

export default router;
