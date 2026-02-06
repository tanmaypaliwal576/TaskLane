import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadfiles = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }

        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: "raw"
            }
        );

        // delete temp file after upload
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error in Uploading File",
            error: error.message
        });
    }
};
