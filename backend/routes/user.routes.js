import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getMyTasks,
  updatetasks,
} from "../controllers/task.controller.js";
import { authorize } from "../middlewares/role.middleware.js";
const router = express.Router();

router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    message: "User Featched Successfully!!",
    user: req.user,
  });
});

router.get("/mytasks", protect, authorize("user"), getMyTasks);

router.patch("/:id/status", protect, authorize("user"), updatetasks);

export default router;
