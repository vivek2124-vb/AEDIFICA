import Project from "../models/Project.js";
import cloudinary from "../utils/cloudinary.js";

// 🚀 CREATE PROJECT WITH IMAGE UPLOAD
export const createProjectWithUpload = async (req, res) => {
  try {
    const { title, description, projectDate, location, supplies } = req.body; // ← NEW fields

    if (!title || !description || !projectDate || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }

    // Convert supplies textarea (new lines) to array
    const suppliesArray = supplies
      ? supplies
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    let uploadedImages = [];
    for (let file of req.files) {
      if (!file.mimetype.startsWith("image")) {
        return res.status(400).json({ message: "Only image files allowed" });
      }
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "aedifica_projects", resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(file.buffer);
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const project = await Project.create({
      title,
      description,
      projectDate,
      location, // ← NEW
      supplies: suppliesArray, // ← NEW
      images: uploadedImages,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🌍 GET ALL
export const getProjects = async (req, res) => {
  const projects = await Project.find().sort({ projectDate: -1 });
  res.json({ data: projects });
};

// 🔍 GET ONE
export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
};

// ❌ DELETE
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  for (let img of project.images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }
  await project.deleteOne();
  res.json({ message: "Deleted" });
};

// ✏️ UPDATE (now also handles new fields)
export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const { title, description, projectDate, location, supplies } = req.body;

  if (title) project.title = title;
  if (description) project.description = description;
  if (projectDate) project.projectDate = projectDate;
  if (location) project.location = location; // ← NEW
  if (supplies) {
    project.supplies = supplies
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean); // ← NEW
  }

  await project.save();
  res.json(project);
};
