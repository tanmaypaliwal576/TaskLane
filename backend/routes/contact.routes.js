import {Router } from "express";
import { contact } from "../controllers/contact.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/" , protect, contact)

export default router;