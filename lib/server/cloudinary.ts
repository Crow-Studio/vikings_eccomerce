import { v2 as cloudinary } from "cloudinary"

if (!cloudinary) {
    throw new Error("Cloudinary SDK not found, check package.json and runtime environment");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

export { cloudinary };
