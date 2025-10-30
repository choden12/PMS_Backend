import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { body } from "express-validator";
import { validate } from "../utils/validator";

const router = Router();

router.post("/register",
  [ body("name").isString().notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 }) ],
  validate, register);

router.post("/login",
  [ body("email").isEmail(), body("password").notEmpty() ],
  validate, login);

export default router;
