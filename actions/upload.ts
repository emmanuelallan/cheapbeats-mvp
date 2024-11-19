"use server";

import { r2Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

type UploadResult = {
  url?: string;
  error?: string;
};

export async function uploadFile(
  file: File,
  bucket: "public" | "private"
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop() || "";
    const fileName = `${bucket}/${uuidv4()}.${fileExt}`;

    // Use the single bucket name
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    await r2Client.send(new PutObjectCommand(uploadParams));

    // Return the appropriate URL based on bucket type
    const baseUrl =
      bucket === "private"
        ? process.env.CLOUDFLARE_R2_PRIVATE_URL
        : process.env.CLOUDFLARE_R2_PUBLIC_URL;

    return { url: `${baseUrl}/${fileName}` };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload file" };
  }
}
