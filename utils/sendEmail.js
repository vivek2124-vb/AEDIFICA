import nodemailer from "nodemailer";

const autoReplyMap = new Map();

// Create transporter once
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,import nodemailer from "nodemailer";

const autoReplyMap = new Map();

// ✅ Improved Gmail configuration for Render
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,           // false for 587 port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,   // Important for Render
  },
  pool: true,
  timeout: 15000,
});

export const sendEmail = async (data) => {
  try {
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!ownerEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email environment variables");
    }

    console.log("📧 Attempting to send email to owner:", ownerEmail);

    // Email to owner
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

    console.log("✅ Owner email sent successfully");

    // Auto-reply
    const now = Date.now();
    const lastSent = autoReplyMap.get(data.email);

    if (!lastSent || now - lastSent > 5 * 60 * 1000) {
      console.log("📧 Sending auto-reply to:", data.email);

      await transporter.sendMail({
        from: `"Aedifica Team" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: "Thanks for contacting Aedifica",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <img src="https://res.cloudinary.com/duwvstens/image/upload/v1742445401/logo_192_v39a57.png" alt="Aedifica Logo" style="width:150px;" />
            <h2>Thank You, ${data.name}! 🙌</h2>
            <p>We have received your message and our team will contact you soon.</p>
            <p><b>Your Message:</b></p>
            <p style="background:#f4f4f4; padding:15px; border-radius:8px;">${data.message}</p>
            <br/>
            <p>Best Regards,<br/><b>Aedifica Team</b></p>
          </div>
        `,
      });

      autoReplyMap.set(data.email, now);
      console.log("✅ Auto-reply sent successfully");
    }

    return { success: true, message: "Message sent successfully!" };

  } catch (error) {
    console.error("❌ EMAIL FAILED (full details):");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full stack:", error.stack);
    throw error;
  }
};
  timeout: 15000,
});

export const sendEmail = async (data) => {
  try {
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!ownerEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing EMAIL_USER / EMAIL_PASS / OWNER_EMAIL in environment variables");
    }

    console.log("📧 Attempting to send email to owner:", ownerEmail);

    // Email to owner
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

    console.log("✅ Owner email sent successfully");

    // Auto-reply (spam safe)
    const now = Date.now();
    const lastSent = autoReplyMap.get(data.email);

    if (!lastSent || now - lastSent > 5 * 60 * 1000) {
      console.log("📧 Sending auto-reply to:", data.email);

      await transporter.sendMail({
        from: `"Aedifica Team" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: "Thanks for contacting Aedifica",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <img src="https://res.cloudinary.com/duwvstens/image/upload/v1742445401/logo_192_v39a57.png" alt="Aedifica Logo" style="width:150px;" />
            <h2>Thank You, ${data.name}! 🙌</h2>
            <p>We have received your message and our team will contact you soon.</p>
            <p><b>Your Message:</b></p>
            <p style="background:#f4f4f4; padding:15px; border-radius:8px;">${data.message}</p>
            <br/>
            <p>Best Regards,<br/><b>Aedifica Team</b></p>
          </div>
        `,
      });

      autoReplyMap.set(data.email, now);
      console.log("✅ Auto-reply sent successfully");
    }

    return { success: true, message: "Message sent successfully!" };

  } catch (error) {
    console.error("❌ EMAIL FAILED (full details):");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    console.error("Full stack:", error.stack);
    throw error;
  }
};
