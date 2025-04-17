// @/lib/r2.ts
// ✨ File to handle Cloudflare R2 interactions (with Buffering and Batched Deletion) ✨

import { Buffer } from "buffer"; // Import Buffer
import {
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput, // Import output type for result aggregation
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
  S3ServiceException, // Import specific exception type
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// 🛠️ Get R2 configuration  and S3 Client Initialization from environment variables
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
export const R2_PUBLIC_URL_BASE = process.env.R2_PUBLIC_URL_BASE; // 👈 Export base URL

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
  // Basic check if it's already an R2 URL (prevent re-uploading)
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
    //   `✅ ☁️ [${adArchiveId}] ${mediaType} uploaded successfully: ${publicUrl}`,
    // );
    return publicUrl;
  } catch (error) {
    console.error(
      `❌ 🔥 [${adArchiveId}] Error processing/uploading ${mediaType} from ${mediaUrl}:`,
      error,
    );
    return null; // Return null to indicate failure
  }
}

/**
 * 🗑️ Deletes multiple objects from Cloudflare R2 bucket with batching.
 * @param keys - An array of object keys (paths) to delete.
 * @returns True if all deletion requests were successful without errors, false otherwise.
 */
export async function deleteMultipleMediaFromR2(
  keys: string[],
): Promise<boolean> {
  if (!keys || keys.length === 0) {
    console.log("🤷 No R2 keys provided for deletion.");
    return true; // Nothing to delete, consider it successful
  }
  if (!R2_BUCKET_NAME) {
    console.error("🔥 R2_BUCKET_NAME is not configured. Cannot delete media.");
    return false;
  }

  // R2/S3 expects keys in a specific format for DeleteObjectsCommand
  const objectsToDelete: ObjectIdentifier[] = keys.map((key) => ({ Key: key }));
  const BATCH_SIZE = 1000; // S3 limit per DeleteObjects request
  let overallSuccess = true;
  let totalSuccessfullyDeleted = 0;
  let totalErrors = 0;

  // console.log(
  //   `🗑️ Attempting to delete ${objectsToDelete.length} objects from R2 bucket: ${R2_BUCKET_NAME} in batches of ${BATCH_SIZE}...`,
  // );

  // S3 DeleteObjectsCommand has a limit of 1000 keys per request.
  // Implemented batching : split objectsToDelete into chunks of 1000
  // and send multiple DeleteObjectsCommand requests.
  for (let i = 0; i < objectsToDelete.length; i += BATCH_SIZE) {
    const batch = objectsToDelete.slice(i, i + BATCH_SIZE);
    // console.log(
    //   `  - Processing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} keys)...`,
    // );

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: batch,
        Quiet: false, // Get results per object // Set to true if you don't need detailed
      },
    });

    try {
      const result = await s3Client.send(deleteCommand);

      if (result.Deleted) {
        totalSuccessfullyDeleted += result.Deleted.length;
        // console.log(`    Batch ${Math.floor(i / BATCH_SIZE) + 1}: Successfully deleted ${result.Deleted.length} objects.`);
      }

      if (result.Errors && result.Errors.length > 0) {
        overallSuccess = false; // Mark failure if any batch reports errors
        totalErrors += result.Errors.length;
        console.error(
          `    ❌ Errors encountered in batch ${Math.floor(i / BATCH_SIZE) + 1} (${result.Errors.length} failed):`,
        );
        result.Errors.forEach((err) =>
          console.error(
            `      - Key: ${err.Key}, Code: ${err.Code}, Message: ${err.Message}`,
          ),
        );
      }
    } catch (error) {
      overallSuccess = false; // Mark failure if the command itself fails
      console.error(
        `❌ 🔥 Failed to send R2 delete command for batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
        error,
      );
      // If the error is an S3ServiceException, it might contain more details
      if (error instanceof S3ServiceException) {
        console.error(
          `❌  S3 Error Details: RequestId: ${error.$metadata?.requestId}, ExtendedRequestId: ${error.$metadata?.cfId}`,
        );
      }
      // Depending on the error, you might want to stop processing further batches
      // break; // Uncomment to stop after the first failed batch command
    }
  }

  console.log(
    `✅ 🗑️ _ R2 Deletion finished. Total successfully deleted: ${totalSuccessfullyDeleted}, Total errors: ${totalErrors}. Overall success: ${overallSuccess}`,
  );
  return overallSuccess;
}
