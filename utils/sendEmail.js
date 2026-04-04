import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Spam control for auto-reply (prevents spam abuse)
const autoReplyMap = new Map();

// ✅ Create transporter ONLY ONCE (best performance)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,        // reuse connection
  timeout: 15000,
});

export const sendEmail = async (data) => {
  try {
    const ownerEmail = process.env.OWNER_EMAIL;

    // Safety check for environment variables
    if (!ownerEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email environment variables in .env file");
    }

    // ================= 1. EMAIL TO OWNER =================
    await transporter.sendMail({
      from: `"Aedifica Website" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: "New Contact Message",
      html: `
        <h2>📩 New Contact Message</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Message:</b> ${data.message}</p>
      `,
    });

    // ================= 2. AUTO REPLY (SPAM SAFE) =================
    const now = Date.now();
    const lastSent = autoReplyMap.get(data.email);

    if (!lastSent || now - lastSent > 5 * 60 * 1000) {   // 5 minutes
      await transporter.sendMail({
        from: `"Aedifica Team" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: "Thanks for contacting Aedifica",

        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <img src="https://res.cloudinary.com/duwvstens/image/upload/v1742445401/logo_192_v39a57.png" 
                 alt="Aedifica Logo" style="width:150px;" />

            <h2>Thank You, ${data.name}! 🙌</h2>
            <p>We have received your message and our team will contact you soon.</p>

            <p><b>Your Message:</b></p>
            <p style="background:#f4f4f4; padding:15px; border-radius:8px;">
              ${data.message}
            </p>

            <br/>
            <p>Best Regards,<br/><b>Aedifica Team</b></p>
          </div>
        `,
      });

      autoReplyMap.set(data.email, now);
    }

    // ✅ This is what your frontend expects
    return { success: true, message: "Message sent successfully!" };

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;   // Let the route handler catch it properly
  }
};
