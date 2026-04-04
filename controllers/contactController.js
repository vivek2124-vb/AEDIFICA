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

    if (message.trim().length < 10) {
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

    // ================= SAVE TO DATABASE =================
    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    // ================= SEND EMAIL =================
    try {
      await sendEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);

      return res.status(500).json({
        success: false,
        message:
          "Message saved but email could not be sent. Please check mail configuration.",
        error: emailError.message,
      });
    }

    // ================= COOKIE =================
    res.cookie("aedifica_user", email.trim().toLowerCase(), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ================= SUCCESS RESPONSE =================
    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("❌ Contact controller error:", error);
    next(error);
  }
};
