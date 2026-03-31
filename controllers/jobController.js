import Job from "../models/Job.js";

// ✅ CREATE JOB
export const createJob = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET ALL JOBS
export const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
};

// ✅ DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed ❌" });
  }
};
