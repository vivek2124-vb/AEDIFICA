import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  let token;

  // Check Authorization Header
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // Extract Token
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get Admin (without password)
      req.admin = await Admin.findById(decoded.id).select("-password");

      // ✅ Check if admin exists
      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);

      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};
