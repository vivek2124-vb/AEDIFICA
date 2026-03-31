import express from "express";
import { loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// ✅ Base route (to avoid "Cannot POST /api/admin")
router.get("/", (req, res) => {
  res.send("Admin API is working ✅");
});

// ✅ Login route
router.post("/login", loginAdmin);

export default router;
