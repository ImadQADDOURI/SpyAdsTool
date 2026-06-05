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

import { AdData, Media } from "@/types/ad";

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

/**
 * 🔄 Processes AdData to upload media to R2 and replace URLs.
 * Modifies the input adData object directly based on user requirements.
 * @param adData - The ad data object to process.
 * @param ad_archive_id - The ID of the ad for naming files.
 */
export async function processAdMediaForR2(
  adData: AdData,
  ad_archive_id: string,
): Promise<void> {
  // console.log(`🚀 [${ad_archive_id}] Starting R2 processing...`);
  if (!adData.snapshot) {
    console.log(
      `[${ad_archive_id}] No snapshot found, skipping R2 processing.`,
    );
    return;
  }

  const snapshot = adData.snapshot;

  // --- Process Page Profile Picture ---
  if (snapshot.page_profile_picture_url) {
    const r2Url = await uploadMediaToR2(
      snapshot.page_profile_picture_url,
      ad_archive_id,
      "profile",
    );
    snapshot.page_profile_picture_url = r2Url ?? null; // Replace with R2 URL or nullify if upload failed
    if (r2Url) {
      // console.log(`[${ad_archive_id}] Profile picture updated to R2 URL.`);
    } else {
      console.log(
        `[${ad_archive_id}] Profile picture URL nullified (upload failed or original fetch failed).`,
      );
    }
  } else {
    console.log(`[${ad_archive_id}] No profile picture URL found.`);
  }
  // Also process branded content profile picture if it exists
  if (snapshot.branded_content?.page_profile_pic_url) {
    const r2Url = await uploadMediaToR2(
      snapshot.branded_content.page_profile_pic_url,
      ad_archive_id,
      "branded_profile",
    );
    snapshot.branded_content.page_profile_pic_url = r2Url ?? null;
    if (r2Url) {
      // console.log(
      //   `[${ad_archive_id}] Branded profile picture updated to R2 URL.`,
      // );
    } else {
      console.log(`[${ad_archive_id}] Branded profile picture URL nullified.`);
    }
  }

  // --- Process Media Arrays (Cards, Images, Videos) ---
  const mediaArrays: (Media[] | undefined)[] = [
    snapshot.cards,
    snapshot.images,
    snapshot.videos,
    // snapshot.extra_images, // Add others if needed
    // snapshot.extra_videos,
  ];

  // Helper to process a single media item according to new rules
  const processMediaItem = async (item: Media): Promise<Media> => {
    const newItem = { ...item }; // Shallow copy

    // URLs to potentially upload and store
    const urlsToStore: { key: keyof Media; type: string }[] = [
      { key: "resized_image_url", type: "resized" },
      { key: "watermarked_resized_image_url", type: "watermarked_resized" },
      { key: "video_preview_image_url", type: "preview" },
      { key: "video_sd_url", type: "video_sd" },
      { key: "watermarked_video_sd_url", type: "watermarked_sd" },
    ];

    // Process each URL we want to store
    for (const { key, type } of urlsToStore) {
      const originalUrl = newItem[key] as string | null | undefined;
      if (originalUrl) {
        const r2Url = await uploadMediaToR2(originalUrl, ad_archive_id, type);
        (newItem[key] as string | null) = r2Url ?? null; // Replace with R2 URL or nullify if upload failed
      } else {
        (newItem[key] as null) = null; // Ensure it's null if no original URL
      }
    }

    // URLs to always nullify
    newItem.original_image_url = null;
    newItem.video_hd_url = null;
    newItem.watermarked_video_hd_url = null;

    // Nullify any other potential Facebook URLs (example: image_crops could contain URLs)
    // Add specific nullifications here if other fields contain expiring URLs
    // newItem.image_crops = undefined; // Example if image_crops contained URLs

    return newItem;
  };

  // Iterate through media arrays and process items concurrently
  for (let i = 0; i < mediaArrays.length; i++) {
    const mediaArray = mediaArrays[i];
    if (mediaArray) {
      // console.log(
      //   `[${ad_archive_id}] Processing ${mediaArray.length} items in media array ${i}...`,
      // );
      // Process items concurrently
      const processedArray = await Promise.all(
        mediaArray.map(processMediaItem),
      );

      // Replace the original array in the snapshot
      if (i === 0) snapshot.cards = processedArray;
      else if (i === 1) snapshot.images = processedArray;
      else if (i === 2) snapshot.videos = processedArray;
      // Add conditions for extra_images, extra_videos if processing them
    }
  }
  console.log(`✅ 💭 _ [${ad_archive_id}] Finished R2 processing.`);
}

// --- Helper Function to Extract R2 Keys ---

/**
 * 🔑 Extracts R2 object keys from various fields within the AdData structure.
 * @param adData - The strongly-typed AdData object.
 * @returns An array of unique R2 object keys found.
 */
export function extractR2KeysFromAdData(adData: AdData): string[] {
  // 👈 Use AdData type
  const keys = new Set<string>();
  // Base URL check is important before proceeding
  if (!R2_PUBLIC_URL_BASE) {
    console.warn("⚠️ R2_PUBLIC_URL_BASE not set, cannot extract keys.");
    return [];
  }

  // 👇 Internal helper function to reduce repetition
  const extractKey = (url: string | null | undefined) => {
    if (url && typeof url === "string" && url.startsWith(R2_PUBLIC_URL_BASE!)) {
      // Extract the key part after the base URL
      // Use URL constructor for robust parsing
      try {
        const urlObject = new URL(url);
        // Remove leading slash from pathname if present
        const key = urlObject.pathname.startsWith("/")
          ? urlObject.pathname.substring(1)
          : urlObject.pathname;
        if (key) {
          // Ensure key is not empty
          keys.add(key);
        }
      } catch (e) {
        console.warn(
          `[Key Extraction] Failed to parse potential R2 URL: ${url}`,
          e,
        );
      }
    }
  };

  // Use the specific types from AdData now
  if (adData.snapshot) {
    extractKey(adData.snapshot.page_profile_picture_url); // Already optional string | null
    if (adData.snapshot.branded_content) {
      // Check if branded_content exists
      extractKey(adData.snapshot.branded_content.page_profile_pic_url); // Already optional string | null
    }

    // Check media arrays (handle optional arrays)
    const mediaArrays: (Media[] | undefined)[] = [
      adData.snapshot.cards,
      adData.snapshot.images,
      adData.snapshot.videos,
    ];

    for (const mediaArray of mediaArrays) {
      if (Array.isArray(mediaArray)) {
        for (const item of mediaArray) {
          // No need to check item type if Media[] is guaranteed by AdData type
          // Check all relevant URL fields within a media item (already optional strings | null)
          extractKey(item.resized_image_url);
          extractKey(item.watermarked_resized_image_url);
          extractKey(item.video_preview_image_url);
          extractKey(item.video_sd_url);
          extractKey(item.watermarked_video_sd_url);
          // Add other fields here if they might contain R2 URLs
        }
      }
    }
  } else {
    // Should not happen if AdData type is correct, but good to log
    console.warn("[Key Extraction] AdData object missing snapshot field.");
  }

  const uniqueKeys = Array.from(keys);
  if (uniqueKeys.length > 0) {
    // Only log if keys were found
    // console.log(`🔑 Extracted ${uniqueKeys.length} unique R2 keys.`);
  }
  return uniqueKeys;
}
