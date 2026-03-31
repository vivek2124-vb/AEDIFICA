import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = [];

    for (const file of files) {
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "aedifica_projects" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer();

      imageUrls.push(result.secure_url);
    }

    res.status(200).json({
      success: true,
      images: imageUrls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
