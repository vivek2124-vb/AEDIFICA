import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createProjectWithUpload,
} from "../controllers/projectController.js";

const router = express.Router();

// Public Routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin Routes
// NEW: Single API → Upload images + Create project
router.post(
  "/create-with-images",
  protect,
  upload.array("images", 5),
  createProjectWithUpload,
);

// Admin update/delete (still separate)
router.put("/update/:id", protect, updateProject);
router.delete("/delete/:id", protect, deleteProject);

export default router;
