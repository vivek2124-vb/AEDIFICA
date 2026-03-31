import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: String,
    type: String, // Full-time / Part-time
    experience: String,
    description: String,
    skills: [String],
    salary: String,
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
