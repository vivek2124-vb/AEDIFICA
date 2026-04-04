import nodemailer from "nodemailer";

// ✅ Spam control for auto-reply
const autoReplyMap = new Map();

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS is missing in environment variables");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (data) => {
  const transporter = createTransporter();

  // ✅ Verify transporter before sending
  await transporter.verify();

  const ownerEmail = process.env.OWNER_EMAIL;

  if (!ownerEmail) {
    throw new Error("OWNER_EMAIL is missing in environment variables");
  }

  // ================= 1. EMAIL TO OWNER =================
  const ownerMailOptions = {
    from: `"Aedifica Website" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    replyTo: data.email,
    subject: "New Contact Message - Aedifica",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
        <h2>📩 New Contact Message</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Message:</b></p>
        <div style="background:#f4f4f4; padding:12px; border-radius:8px; white-space:pre-wrap;">
          ${data.message}
        </div>
      </div>
    `,
  };

  const ownerInfo = await transporter.sendMail(ownerMailOptions);
  console.log("✅ Owner email sent:", ownerInfo.messageId);

  // ================= 2. AUTO REPLY (SPAM SAFE) =================
  const now = Date.now();
  const lastSent = autoReplyMap.get(data.email);

  if (!lastSent || now - lastSent > 5 * 60 * 1000) {
    const userMailOptions = {
      from: `"Aedifica Team" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Thanks for contacting Aedifica",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
          <img 
            src="https://res.cloudinary.com/duwvstens/image/upload/v1774245401/logo_192_v39a57.png" 
            alt="Aedifica Logo"
            style="width:150px; margin-bottom: 20px;"
          />

          <h2>Thank You, ${data.name}! 🙌</h2>

          <p>We have received your message and our team will contact you soon.</p>

          <p><b>Your Message:</b></p>
          <div style="background:#f4f4f4; padding:12px; border-radius:8px; white-space:pre-wrap;">
            ${data.message}
          </div>

          <br />
          <p>Best Regards,<br /><b>Aedifica Team</b></p>
        </div>
      `,
    };

    const userInfo = await transporter.sendMail(userMailOptions);
    console.log("✅ Auto-reply email sent:", userInfo.messageId);

    autoReplyMap.set(data.email, now);
  } else {
    console.log("ℹ️ Auto-reply skipped due to 5-minute spam protection");
  }

  return true;
};
