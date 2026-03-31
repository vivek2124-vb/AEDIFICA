import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

dotenv.config();

// ✅ Use same DB connection
await connectDB();

const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      email: "admin@aedifica.com",
    });

    if (existingAdmin) {
      console.log("❌ Admin already exists");
      process.exit();
    }

    const admin = new Admin({
      email: "admin@aedifica.com",
      password: "123456",
    });

    await admin.save();
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

createAdmin();
