import express from "express";
import multer from "multer";
import { uploadfiles } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/uploadbyuser", upload.single("file"), uploadfiles);

export default router;
