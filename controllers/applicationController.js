import Application from "../models/Application.js";
import fs from "fs"; // ✅ for deleting file

// ================= APPLY JOB =================
export const applyJob = async (req, res) => {
  try {
    const { name, email, phone, jobId } = req.body;

    // ✅ Get uploaded file path
    const resume = req.file ? req.file.path : "";

    const application = await Application.create({
      name,
      email,
      phone,
      jobId,
      resume,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Application failed" });
  }
};

// ================= GET ALL APPLICATIONS =================
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("jobId", "title");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE APPLICATION =================
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    // ❌ If not found
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Delete resume file from uploads folder
    if (application.resume) {
      fs.unlink(application.resume, (err) => {
        if (err) console.log("File delete error:", err);
      });
    }

    // ✅ Delete from DB
    await application.deleteOne();

    res.json({ message: "Application deleted ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed ❌" });
  }
};
