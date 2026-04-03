import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Routes
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Middleware
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

// ✅ Connect DB
connectDB();

// ✅ CREATE APP FIRST
const app = express();

// ================= MIDDLEWARE =================

// ✅ CORS (Updated for Vercel + Local)
app.use(
  cors({
    origin: [
     "https://aedifica.in
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Body parser
app.use(express.json());

// ✅ Cookie parser
app.use(cookieParser());

// 🔥 ✅ VERY IMPORTANT
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Aedifica API Running ");
});

// ✅ API Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
