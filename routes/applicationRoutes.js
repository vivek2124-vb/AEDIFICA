import express from "express";
import {
  applyJob,
  getApplications,
  deleteApplication, // ✅ IMPORT DELETE
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// ✅ Multer config (simple local storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// CREATE APPLICATION (with resume upload)
router.post("/", upload.single("resume"), applyJob);

// GET ALL APPLICATIONS (ADMIN PROTECTED)
router.get("/", protect, getApplications);

//  DELETE APPLICATION (ADMIN)
router.delete("/:id", protect, deleteApplication);

export default router;
