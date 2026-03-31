import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    resume: String, // Cloudinary URL
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Application", applicationSchema);
