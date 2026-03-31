import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    projectDate: { type: Date, required: [true, "Project date is required"] },
    location: { type: String, required: [true, "Location is required"] }, // ← NEW
    supplies: { type: [String], default: [] }, // ← NEW (bullet points)
    // 🔥 MULTIPLE IMAGES (Cloudinary)
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: false },
      },
    ],
    default: [],
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
