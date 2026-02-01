import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createtask } from "../controllers/task.controller.js";
import { getallusers } from "../controllers/getallusers.controller.js";
import { getManagerTasks } from "../controllers/task.controller.js"
const router = express.Router();

router.get("/dashboard", protect, authorize("manager"), (req, res) => {
  res.json({ message: "Manager dashboard ✅" });
});

router.post("/create", protect, authorize("manager"), createtask);

router.get("/mytasks", protect, authorize("manager"),getManagerTasks) 

router.get("/allusers",protect, authorize("manager"), getallusers);

export default router;
