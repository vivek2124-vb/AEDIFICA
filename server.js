import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

// Routes
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Middleware
import { errorHandler } from "./middlewares/errorHandler.js";

// ✅ Connect DB
connectDB();

// ✅ App
const app = express();

// ================= CORS =================
const allowedOrigins = [
  "https://aedifica.in",
  "https://www.aedifica.in",
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / mobile apps / server-to-server ke liye
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= COOKIE =================
app.use(cookieParser());

// ================= STATIC =================
app.use("/uploads", express.static("uploads"));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Aedifica API Running");
});

// ================= ROUTES =================
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
