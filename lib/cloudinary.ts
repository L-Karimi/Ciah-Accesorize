import "server-only";

import { v2 as cloudinary } from "cloudinary";

const PRODUCT_IMAGE_FOLDER = "ciah-accessorize/products";
const MAX_PRODUCT_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

let isConfigured = false;

function configureCloudinary() {
  if (isConfigured) {
    return;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  isConfigured = true;
}

export async function uploadProductImage(file: File) {
  configureCloudinary();

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported for products.");
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new Error("Each product image must be 8 MB or smaller.");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: PRODUCT_IMAGE_FOLDER,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary did not return an image URL."));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.on("error", reject);
    stream.end(fileBuffer);
  });
}
