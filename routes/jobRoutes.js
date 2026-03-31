import express from "express";
import { createJob, getJobs, deleteJob } from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", getJobs);
router.delete("/:id", protect, deleteJob);

export default router;
