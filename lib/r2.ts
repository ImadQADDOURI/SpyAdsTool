// @/lib/r2.ts
// ✨ File to handle Cloudflare R2 interactions (with Buffering) ✨

import { Buffer } from "buffer"; // Import Buffer
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Optional: If you need signed URLs later
import { v4 as uuidv4 } from "uuid"; // For generating unique filenames

// 🛠️ Get R2 configuration from environment variables
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE; // e.g., https://pub-xxx.r2.dev

// 🚨 Basic validation for environment variables
if (
  !R2_ENDPOINT ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME ||
  !R2_PUBLIC_URL_BASE
) {
  console.error("🔥 Missing Cloudflare R2 environment variables!");
  // Consider throwing an error in production environments
  // throw new Error("Missing Cloudflare R2 environment variables!");
}

// ☁️ Initialize the S3 Client configured for R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT!,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
  // You might need to explicitly disable sha256 calculation if buffering doesn't fix it,
  // but try buffering first. Add `sha256: "UNSIGNED_PAYLOAD"` to the client config if needed.
});

/**
 * 📤 Uploads media from a URL to Cloudflare R2 (Now Buffers Content)
 * @param mediaUrl - The URL of the media file to download and upload
 * @param adArchiveId - The ad archive ID, used for organizing files
 * @param mediaType - A string indicating the type (e.g., 'resized', 'video_sd', 'profile')
 * @returns The public URL of the uploaded file in R2, or null if upload fails
 */
export async function uploadMediaToR2(
  mediaUrl: string,
  adArchiveId: string,
  mediaType: string,
): Promise<string | null> {
  // Input validation
  if (!mediaUrl || !R2_BUCKET_NAME || !R2_PUBLIC_URL_BASE) {
    console.error(
      `🚫 Missing media URL ('${mediaUrl}') or R2 config for upload.`,
    );
    return null;
  }
  // Basic check if it's already an R2 URL
  if (mediaUrl.startsWith(R2_PUBLIC_URL_BASE)) {
    // console.log(
    //   `⏭️ [${adArchiveId}] Skipping upload, already an R2 URL: ${mediaUrl}`,
    // );
    return mediaUrl;
  }

  // console.log(
  //   `📥 [${adArchiveId}] Attempting to fetch ${mediaType}: ${mediaUrl}`,
  // );

  try {
    // 1. 🌐 Fetch the media file
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      console.warn(
        `[${adArchiveId}] Failed to fetch media (${response.status} ${response.statusText}) from: ${mediaUrl}`,
      );
      return null;
    }
    // Removed check for response.body as arrayBuffer() handles it

    // ❓ Get content type early for filename and upload metadata
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const fileExtension = contentType.split("/")[1]?.split(";")[0] || "bin";

    // 💾 Buffer the entire response body
    // console.log(`⏳ [${adArchiveId}] Buffering ${mediaType} content...`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // console.log(
    //   `[${adArchiveId}] ${mediaType} content buffered (${buffer.length} bytes).`,
    // );

    // 2. 📛 Generate a unique filename
    const uniqueKey = `${adArchiveId}/${mediaType}_${uuidv4()}.${fileExtension}`;

    // console.log(
    //   `⬆️ [${adArchiveId}] Uploading ${mediaType} to R2 with key: ${uniqueKey}`,
    // );

    // 3. ☁️ Upload to R2 using the Buffer
    const putObjectCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      Body: buffer, // Pass the complete buffer
      ContentType: contentType,
      ContentLength: buffer.length, // Provide content length now that we have the buffer
    });

    await s3Client.send(putObjectCommand);

    // 4. 🔗 Construct the public URL
    const publicUrl = `${R2_PUBLIC_URL_BASE.replace(/\/$/, "")}/${uniqueKey}`;

    // console.log(
    //   `✅ [${adArchiveId}] ${mediaType} uploaded successfully: ${publicUrl}`,
    // );
    return publicUrl;
  } catch (error) {
    // Log the specific error, which might be different now
    console.error(
      `🔥 [${adArchiveId}] Error processing/uploading ${mediaType} from ${mediaUrl}:`,
      error,
    );
    return null; // Return null to indicate failure
  }
}
