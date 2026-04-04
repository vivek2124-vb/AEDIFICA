import Contact from "../models/Contact.js";
import { sendEmail } from "../utils/sendEmail.js";

// ✅ Spam control (API level)
const emailRequestMap = new Map();

export const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // ================= VALIDATION =================
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters",
      });
    }

    // ================= SPAM PROTECTION =================
    const now = Date.now();
    const lastRequest = emailRequestMap.get(email);
    if (lastRequest && now - lastRequest < 60000) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait 1 minute.",
      });
    }
    emailRequestMap.set(email, now);

    // ================= SAVE TO DATABASE FIRST =================
    const newContact = await Contact.create({
      name,
      email,
      message,
    });

    // ================= SEND EMAIL IN BACKGROUND (NO TIMEOUT) =================
    // We respond to user immediately, then send email asynchronously
    sendEmail({ name, email, message }).catch((err) => {
      console.error("❌ Background email failed:", err);
      // Don't crash the route
    });

    // ================= COOKIE =================
    res.cookie("aedifica_user", email, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ================= INSTANT SUCCESS RESPONSE =================
    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newContact,
    });

  } catch (error) {
    console.error("Contact controller error:", error);
    next(error);
  }
};
