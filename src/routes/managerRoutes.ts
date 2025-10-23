import express from "express";
import {
  getManagers,
  addManager,
  updateManager,
} from "../controllers/managerController";

const router = express.Router();

router.get("/", getManagers);
router.post("/", addManager);
router.put("/:id", updateManager);

export default router;
