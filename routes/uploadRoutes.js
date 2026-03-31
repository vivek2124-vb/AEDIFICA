import express from "express";
import { uploadImages } from "../controllers/uploadController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin only upload
router.post("/", protect, upload.array("images", 5), uploadImages);

export default router;
