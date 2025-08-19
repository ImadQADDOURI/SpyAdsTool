// @/actions/savedAds.ts

"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client"; // Keep for general DB types if needed
import { z } from "zod";

import { AdData, Media } from "@/types/ad";
import { prisma } from "@/lib/db";
import {
  deleteMultipleMediaFromR2, // 👈 Import R2 deletion function
  R2_PUBLIC_URL_BASE, // 👈 Import R2 base URL for key extraction
  uploadMediaToR2,
} from "@/lib/r2";
import { getCurrentUser } from "@/lib/session";

// 🎯 Helper function to extract image URL
function extractImageFromAd(adData: AdData): string | null {
  // Return null if none found
  const snapshot = adData.snapshot;
  if (!snapshot) return null; // Return null instead of undefined

  // Combine all potential media sources
  const mediaItems: Media[] = [
    ...(snapshot.cards ?? []),
    ...(snapshot.images ?? []),
    ...(snapshot.videos ?? []),
    // Add others like extra_images if they can contain previews
  ];

  for (const item of mediaItems) {
    // Check for the primary preview/image fields (these might be R2 URLs now)
    if (item.resized_image_url) {
      return item.resized_image_url;
    }
    if (item.video_preview_image_url) {
      return item.video_preview_image_url;
    }
    // Add fallbacks if necessary, e.g., watermarked versions
    if (item.watermarked_resized_image_url) {
      return item.watermarked_resized_image_url;
    }
  }
  // If no suitable image found in cards/images/videos, check the profile pic as a last resort
  if (snapshot.page_profile_picture_url) {
    return snapshot.page_profile_picture_url;
  }

  return null; // Return null if no image URL found
}

/**
 * 🔄 Processes AdData to upload media to R2 and replace URLs.
 * Modifies the input adData object directly based on user requirements.
 * @param adData - The ad data object to process.
 * @param ad_archive_id - The ID of the ad for naming files.
 */
async function processAdMediaForR2(
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
function extractR2KeysFromAdData(adData: AdData): string[] {
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

// 💾 Save ad to a user's board
export async function saveAdToBoard(
  ad_archive_id: string,
  board: string,
  adDataInput: AdData, // Rename input to avoid confusion
) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }
    // 📝 Validate inputs
    if (!ad_archive_id || !board || !adDataInput) {
      // Check adDataInput
      return { error: "Missing required fields" };
    }

    // 🔍 Check if ad already exists in the board
    const existingAd = await prisma.savedAd.findFirst({
      where: {
        userId: user.id,
        ad_archive_id,
        board,
      },
    });

    // 📊 Check saved ads limit for new ads only (skip for ADMIN users)
    if (!existingAd && user.role !== "ADMIN") {
      const maxSavedAds = parseInt(process.env.MAX_SAVED_ADS_PER_USER || "100");

      const userSavedAdsCount = await prisma.savedAd.count({
        where: {
          userId: user.id,
        },
      });

      if (userSavedAdsCount >= maxSavedAds) {
        return {
          error: `Maximum saved ads limit reached (${maxSavedAds}). Please remove some ads before saving new ones.`,
        };
      }
    }

    // 📄 Deep copy the adData to avoid modifying the original object passed to the function
    const adDataToProcess = JSON.parse(JSON.stringify(adDataInput));
    // ✨ Process media: Download from FB, Upload to R2, Replace/Nullify URLs ✨
    await processAdMediaForR2(adDataToProcess, ad_archive_id);
    // 🖼️ Extract image URL (using the processed adDataToProcess)
    // This will return an R2 URL if available, or null
    const imageUrl = extractImageFromAd(adDataToProcess);

    const dataPayload = {
      adData: adDataToProcess, // Store the processed adData
      imageUrl: imageUrl, // Store the extracted preview image URL (could be R2 or null)
      updatedAt: new Date(),
    };

    if (existingAd) {
      // ✏️ Update existing ad with latest processed data
      await prisma.savedAd.update({
        where: { id: existingAd.id },
        data: dataPayload,
      });
      // console.log(
      //   `🔄 Ad ${ad_archive_id} updated in board ${board} with processed R2/nullified URLs.`,
      // );
    } else {
      // ➕ Create new saved ad with processed data
      await prisma.savedAd.create({
        data: {
          ad_archive_id,
          board,
          adData: dataPayload.adData,
          imageUrl: dataPayload.imageUrl,
          userId: user.id,
          // createdAt is handled by default
        },
      });
      console.log(
        `✅ 🔽  Ad ${ad_archive_id} saved to board ${board} with processed R2/nullified URLs.`,
      );
    }
    revalidatePath("/favorites"); // Or the relevant path
    return { success: true };
  } catch (error) {
    console.error("🔥 Failed to save ad with R2 processing:", error);
    // Provide a more specific error message if possible
    if (error instanceof Error) {
      return { error: `Failed to save ad: ${error.message}` };
    }
    return { error: "An unknown error occurred while saving the ad" };
  }
}
// 🗑️ Unsave/remove ad from board (Updated with R2 Deletion)
export async function removeAdFromBoard(ad_archive_id: string, board: string) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) return { error: "Unauthorized" };

    // 1. Find the ad first to get its data for R2 key extraction

    const savedAd = await prisma.savedAd.findFirst({
      where: { userId: user.id, ad_archive_id, board },
    });

    if (!savedAd) {
      console.log(
        `[Delete Ad] Ad ${ad_archive_id} in board ${board} not found for user ${user.id}.`,
      );
      return { success: true }; // Or return an error if needed: { error: "Ad not found" }
    }
    // 2. Extract R2 keys from the ad data

    // 👇 Assert type here: We expect the JSON stored in Prisma
    //    to conform to the AdData structure from our types.
    const keysToDelete = extractR2KeysFromAdData(
      savedAd.adData as unknown as AdData,
    );

    // 3. Attempt to delete files from R2

    let r2DeletionSuccess = true; // Assume success if no keys
    if (keysToDelete.length > 0) {
      console.log(
        `[Delete Ad] Attempting R2 deletion for ${keysToDelete.length} keys for ad ${ad_archive_id}...`,
      );
      r2DeletionSuccess = await deleteMultipleMediaFromR2(keysToDelete);
      if (!r2DeletionSuccess) {
        console.error(
          `[Delete Ad] R2 deletion failed or partially failed for ad ${ad_archive_id}. Proceeding with DB deletion.`,
        );
        // Decide on error handling - return error or continue
        // Optionally, you could return an error here if R2 deletion is critical
        // return { error: "Failed to delete associated media files." };
      }
    } else {
      // console.log(
      //   `[Delete Ad] No R2 keys found to delete for ad ${ad_archive_id}.`,
      // );
    }

    // 4. Delete the saved ad from the database
    await prisma.savedAd.delete({ where: { id: savedAd.id } });
    console.log(
      `✅ 🗑️ _ [Delete Ad] Successfully deleted ad ${ad_archive_id} from board ${board} in DB.`,
    );

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error(
      `❌ [Delete Ad] Failed to remove ad ${ad_archive_id} from board ${board}:`,
      error,
    );
    return { error: "Failed to remove ad" };
  }
}

// 🚀 Combined function to fetch both saved ad IDs and boards in one DB call
export async function fetchUserSavedData() {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // 🔍 Single query to get all saved ads with minimal data
    const savedAds = await prisma.savedAd.findMany({
      where: {
        userId: user.id,
      },
      select: {
        ad_archive_id: true,
        board: true,
        imageUrl: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // 📋 Extract saved ad IDs (lightweight for isAdSaved checks)
    const savedIds = savedAds.map((ad) => ({
      ad_archive_id: ad.ad_archive_id,
      board: ad.board,
    }));

    // 🏷️ Process boards data
    const boardsMap = new Map<
      string,
      {
        name: string;
        count: number;
        lastUpdated: Date;
        coverImage: string | null;
      }
    >();

    savedAds.forEach((ad) => {
      const existing = boardsMap.get(ad.board);

      if (!existing) {
        // First ad for this board
        boardsMap.set(ad.board, {
          name: ad.board,
          count: 1,
          lastUpdated: ad.updatedAt,
          coverImage: ad.imageUrl,
        });
      } else {
        // Update count and use latest image if current one is more recent
        existing.count += 1;
        if (ad.updatedAt > existing.lastUpdated) {
          existing.lastUpdated = ad.updatedAt;
          existing.coverImage = ad.imageUrl;
        }
      }
    });

    const boards = Array.from(boardsMap.values());

    return {
      savedIds,
      boards,
    };
  } catch (error) {
    console.error("Failed to fetch saved data:", error);
    return { error: "Failed to fetch saved data" };
  }
}

// 📂 Fetch ads from a specific board
export async function fetchAdsByBoard(board: string, page = 1, pageSize = 20) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // 📊 Pagination
    const skip = (page - 1) * pageSize;

    // 🔍 Query saved ads by board
    const [savedAds, totalCount] = await Promise.all([
      prisma.savedAd.findMany({
        where: {
          userId: user.id,
          board,
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      prisma.savedAd.count({
        where: {
          userId: user.id,
          board,
        },
      }),
    ]);

    return {
      ads: savedAds,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / pageSize),
        current: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch board ads:", error);
    return { error: "Failed to fetch board ads" };
  }
}

// ✏️ Rename a board
export async function renameBoard(oldName: string, newName: string) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // ✅ Validate input
    if (!oldName || !newName) {
      return { error: "Both old and new board names are required" };
    }

    // 🔄 Update board name for all matching ads
    await prisma.savedAd.updateMany({
      where: {
        userId: user.id,
        board: oldName,
      },
      data: {
        board: newName,
      },
    });

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to rename board:", error);
    return { error: "Failed to rename board" };
  }
}

// 🗑️ Delete all ads in a board (Updated with R2 Deletion)
export async function deleteBoard(board: string) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) return { error: "Unauthorized" };

    // 1. Find all ads in the board to extract keys
    const adsInBoard = await prisma.savedAd.findMany({
      where: { userId: user.id, board: board },
      select: { adData: true }, // Only select needed data
    });

    if (adsInBoard.length === 0) {
      console.log(
        `[Delete Board] No ads found in board "${board}" for user ${user.id}.`,
      );
      return { success: true }; // Nothing to delete
    }
    // console.log(
    //   `[Delete Board] Found ${adsInBoard.length} ads in board "${board}".`,
    // );

    const allKeysToDelete = new Set<string>();
    for (const ad of adsInBoard) {
      // 👇 Assert type here, same reason as above
      const keys = extractR2KeysFromAdData(ad.adData as unknown as AdData);
      keys.forEach((key) => allKeysToDelete.add(key));
    }
    const uniqueKeysList = Array.from(allKeysToDelete);

    let r2DeletionSuccess = true;
    if (uniqueKeysList.length > 0) {
      // console.log(
      //   `[Delete Board] Attempting R2 deletion for ${uniqueKeysList.length} unique keys for board "${board}"...`,
      // );
      r2DeletionSuccess = await deleteMultipleMediaFromR2(uniqueKeysList);
      if (!r2DeletionSuccess) {
        console.error(
          `❌ [Delete Board] R2 deletion failed or partially failed for board "${board}". Proceeding with DB deletion.`,
        );
        // Decide on error handling
        // Optionally return an error: return { error: "Failed to delete some media files." };
      }
    } else {
      // console.log(
      //   `[Delete Board] No R2 keys found to delete for board "${board}".`,
      // );
    }

    // 4. Delete all ads in the board from the database
    const deleteResult = await prisma.savedAd.deleteMany({
      where: { userId: user.id, board: board },
    });
    console.log(
      `✅ 🗑️ _ [Delete Board] Successfully deleted ${deleteResult.count} ad records for board "${board}" from DB.`,
    );

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error(`[Delete Board] Failed to delete board "${board}":`, error);
    return { error: "Failed to delete board" };
  }
}
// 🔄 Move all ads from one board to another
export async function moveAdsToBoard(sourceBoard: string, targetBoard: string) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // ✅ Validate input
    if (!sourceBoard || !targetBoard) {
      return { error: "Both source and target board names are required" };
    }

    // Prevent moving to the same board
    if (sourceBoard === targetBoard) {
      return { success: true }; // Nothing to do
    }

    // 🔍 Get all ads from source board
    const sourceAds = await prisma.savedAd.findMany({
      where: {
        userId: user.id,
        board: sourceBoard,
      },
      select: {
        ad_archive_id: true,
      },
    });

    // 🔍 Check for existing ads in target board to avoid unique constraint violations
    const existingTargetAds = await prisma.savedAd.findMany({
      where: {
        userId: user.id,
        board: targetBoard,
        ad_archive_id: {
          in: sourceAds.map((ad) => ad.ad_archive_id),
        },
      },
      select: {
        ad_archive_id: true,
      },
    });

    const existingAdIds = new Set(
      existingTargetAds.map((ad) => ad.ad_archive_id),
    );

    // 🔄 Move ads (update board name)
    await prisma.savedAd.updateMany({
      where: {
        userId: user.id,
        board: sourceBoard,
        ad_archive_id: {
          notIn: Array.from(existingAdIds),
        },
      },
      data: {
        board: targetBoard,
      },
    });

    // 🗑️ Delete duplicates from source board
    if (existingAdIds.size > 0) {
      await prisma.savedAd.deleteMany({
        where: {
          userId: user.id,
          board: sourceBoard,
          ad_archive_id: {
            in: Array.from(existingAdIds),
          },
        },
      });
    }

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to move ads:", error);
    return { error: "Failed to move ads" };
  }
}

// 🔥 Fetch trending ads from specified board name with user role admin
export async function fetchTrendAds(page = 1, pageSize = 10) {
  const ADS_PER_PAGE = pageSize;
  const trendBoardName = process.env.NEXT_PUBLIC_TREND_BOARD_NAME;

  try {
    // If no trend board name is configured, return empty result
    if (!trendBoardName) {
      return {
        ads: [],
        pagination: {
          total: 0,
          pages: 0,
          current: page,
        },
      };
    }

    // 📊 Pagination
    const skip = (page - 1) * ADS_PER_PAGE;

    // 🔍 Get admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    const adminUserIds = adminUsers.map((user) => user.id);

    // If no admin users found, return empty result
    if (adminUserIds.length === 0) {
      return {
        ads: [],
        pagination: {
          total: 0,
          pages: 0,
          current: page,
        },
      };
    }

    // 🔍 Query saved ads from admin users with specific board name
    const [trendAds, totalCount] = await Promise.all([
      prisma.savedAd.findMany({
        where: {
          userId: {
            in: adminUserIds,
          },
          board: trendBoardName,
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: ADS_PER_PAGE,
      }),
      prisma.savedAd.count({
        where: {
          userId: {
            in: adminUserIds,
          },
          board: trendBoardName,
        },
      }),
    ]);

    return {
      ads: trendAds,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / ADS_PER_PAGE),
        current: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch trend ads:", error);
    return { error: "Failed to fetch trend ads" };
  }
}

/**
 * 🎣 Fetches saved ads from the "Extension Saves" board for a specific user.
 *
 * This function retrieves the ad archive ID and the associated image URL.
 *
 * @param userId - The ID of the user whose saved ads are to be fetched.
 * @returns {Promise<{ad_archive_id: string; imageUrl: string | null;}[]>} A promise that resolves to an array of objects,
 * each containing the ad's ID and image URL. Returns an empty array on error or if no ads are found.
 */
export const getExtensionSavedAds = async (
  userId: string,
): Promise<{ ad_archive_id: string; imageUrl: string | null }[]> => {
  // 🛡️ Basic validation for userId
  if (!userId) {
    console.warn("⚠️ [getExtensionSavedAds] No userId provided.");
    return [];
  }

  try {
    // 🔍 Query the database for SavedAd records matching the userId AND the board name
    const savedAds = await prisma.savedAd.findMany({
      where: {
        userId: userId,
        // 👇 Filter by board name.
        board: "Extension Saves",
      },
      // 👉 Select the ad_archive_id and the imageUrl for the response
      select: {
        ad_archive_id: true,
        imageUrl: true, // Fetches the imageUrl field from the SavedAd record
      },
    });

    console.log(
      `📊 [getExtensionSavedAds] Found ${savedAds.length} ads in 'Extension Saves' for user ${userId}.`,
    );
    // ✨ Return the array of objects directly
    return savedAds;
  } catch (error) {
    // 🚨 Handle potential database errors
    console.error(
      `🚨 [getExtensionSavedAds] Error fetching saved ads for user ${userId}:`,
      error,
    );
    // Return an empty array to prevent API errors
    return [];
  }
};
