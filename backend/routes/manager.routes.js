import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createtask } from "../controllers/task.controller.js";
const router = express.Router();

router.get("/dashboard", protect, authorize("manager"), (req, res) => {
  res.json({ message: "Manager dashboard ✅" });
});

router.post("/create", protect, authorize("manager"), createtask);

export default router;
