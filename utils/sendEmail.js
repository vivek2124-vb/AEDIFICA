import nodemailer from "nodemailer";

// ✅ Spam control for auto-reply
const autoReplyMap = new Map();

// ✅ Create transporter once
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  // ✅ Important timeouts so request never hangs too long
  connectionTimeout: 10000, // 10 sec
  greetingTimeout: 10000,
  socketTimeout: 15000, // 15 sec
});

export const sendEmail = async (data) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS missing");
  }

  if (!process.env.OWNER_EMAIL) {
    throw new Error("OWNER_EMAIL missing");
  }

  // ================= 1. EMAIL TO OWNER =================
  const ownerInfo = await transporter.sendMail({
    from: `"Aedifica Website" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    replyTo: data.email,
    subject: "New Contact Message - Aedifica",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>📩 New Contact Message</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Message:</b></p>
        <div style="background:#f4f4f4; padding:10px; border-radius:6px; white-space:pre-wrap;">
          ${data.message}
        </div>
      </div>
    `,
  });

  console.log("✅ Owner email sent:", ownerInfo.messageId);

  // ================= 2. AUTO REPLY =================
  const now = Date.now();
  const lastSent = autoReplyMap.get(data.email);

  if (!lastSent || now - lastSent > 5 * 60 * 1000) {
    const userInfo = await transporter.sendMail({
      from: `"Aedifica Team" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Thanks for contacting Aedifica",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <img 
            src="https://res.cloudinary.com/duwvstens/image/upload/v1774245401/logo_192_v39a57.png" 
            alt="Aedifica Logo"
            style="width:150px; margin-bottom:20px;"
          />

          <h2>Thank You, ${data.name}! 🙌</h2>

          <p>We have received your message and our team will contact you soon.</p>

          <p><b>Your Message:</b></p>
          <div style="background:#f4f4f4; padding:10px; border-radius:6px; white-space:pre-wrap;">
            ${data.message}
          </div>

          <br/>
          <p>Best Regards,<br/><b>Aedifica Team</b></p>
        </div>
      `,
    });

    console.log("✅ Auto-reply sent:", userInfo.messageId);
    autoReplyMap.set(data.email, now);
  } else {
    console.log("ℹ️ Auto-reply skipped (5 min spam control)");
  }
};
