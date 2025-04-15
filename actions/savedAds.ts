// @/actions/savedAds.ts

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AdData, Media } from "@/types/ad"; // Make sure Media is exported from types
import { prisma } from "@/lib/db";
import { uploadMediaToR2 } from "@/lib/r2"; // 👈
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
  // console.log(`🏁 [${ad_archive_id}] Finished R2 processing.`);
}

// 💾 Save ad to a user's board (Updated Logic)
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

    // 📄 Deep copy the adData to avoid modifying the original object passed to the function
    const adDataToProcess = JSON.parse(JSON.stringify(adDataInput));

    // ✨ Process media: Download from FB, Upload to R2, Replace/Nullify URLs ✨
    await processAdMediaForR2(adDataToProcess, ad_archive_id);

    // 🖼️ Extract image URL (using the processed adDataToProcess)
    // This will return an R2 URL if available, or null
    const imageUrl = extractImageFromAd(adDataToProcess);

    // 🔍 Check if ad already exists in the board
    const existingAd = await prisma.savedAd.findFirst({
      where: {
        userId: user.id,
        ad_archive_id,
        board,
      },
    });

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
        `✅ Ad ${ad_archive_id} saved to board ${board} with processed R2/nullified URLs.`,
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

// 🗑️ Unsave/remove ad from board
export async function removeAdFromBoard(ad_archive_id: string, board: string) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // 🧹 Delete the saved ad
    await prisma.savedAd.deleteMany({
      where: {
        userId: user.id,
        ad_archive_id,
        board,
      },
    });

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove ad:", error);
    return { error: "Failed to remove ad" };
  }
}

// 📋 Fetch all saved ads for a user
export async function fetchUserSavedAds(page = 1, pageSize = 20) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // 📊 Pagination
    const skip = (page - 1) * pageSize;

    // 🔍 Query saved ads
    const [savedAds, totalCount] = await Promise.all([
      prisma.savedAd.findMany({
        where: {
          userId: user.id,
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
    console.error("Failed to fetch saved ads:", error);
    return { error: "Failed to fetch saved ads" };
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

// 🏷️ Get all user's board names
export async function getUserBoards() {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // 🔍 Query unique board names
    const boards = await prisma.savedAd.groupBy({
      by: ["board"],
      where: {
        userId: user.id,
      },
      _count: {
        ad_archive_id: true,
      },
    });

    return {
      boards: boards.map((item) => ({
        name: item.board,
        count: item._count.ad_archive_id,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    return { error: "Failed to fetch boards" };
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

// 🗑️ Delete all ads in a board
export async function deleteBoard(board: string) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // ❌ Delete all ads in the board
    await prisma.savedAd.deleteMany({
      where: {
        userId: user.id,
        board,
      },
    });

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete board:", error);
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

// 🔥 Fetch trending ads from specified admin users
export async function fetchTrendAds(page = 1, pageSize = 10) {
  const ADS_PER_PAGE = pageSize;
  const AdminEmails = process.env.TREND_EMAILS?.split(",") || [];

  try {
    // If no admin emails are specified, return empty result
    if (AdminEmails.length === 0) {
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

    // 🔍 Get users with matching emails
    const trendUsers = await prisma.user.findMany({
      where: {
        email: {
          in: AdminEmails,
        },
      },
      select: {
        id: true,
      },
    });

    const trendUserIds = trendUsers.map((user) => user.id);

    // If no matching users found, return empty result
    if (trendUserIds.length === 0) {
      return {
        ads: [],
        pagination: {
          total: 0,
          pages: 0,
          current: page,
        },
      };
    }

    // 🔍 Query saved ads from trend users
    const [trendAds, totalCount] = await Promise.all([
      prisma.savedAd.findMany({
        where: {
          userId: {
            in: trendUserIds,
          },
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
            in: trendUserIds,
          },
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

// * 🎣 Fetches the ad_archive_ids for all ads saved by a specific user.
// *
// * @param userId - The ID of the user whose saved ads are to be fetched.
// * @returns {Promise<string[]>} A promise that resolves to an array of ad_archive_id strings.
// * Returns an empty array if the user has no saved ads or if an error occurs.
// */
export const getUserSavedAdIds = async (userId: string): Promise<string[]> => {
  // 🛡️ Basic validation for userId
  if (!userId) {
    console.warn("⚠️ [getUserSavedAdIds] No userId provided.");
    return [];
  }

  try {
    // 🔍 Query the database for SavedAd records matching the userId
    const savedAds = await prisma.savedAd.findMany({
      where: {
        userId: userId,
      },
      // 👉 Select only the ad_archive_id field for efficiency
      select: {
        ad_archive_id: true,
      },
    });

    // ✨ Map the results to an array of strings
    const adIds = savedAds.map((ad) => ad.ad_archive_id);
    console.log(
      `📊 [getUserSavedAdIds] Found ${adIds.length} saved ad IDs for user ${userId}.`,
    );
    return adIds;
  } catch (error) {
    // 🚨 Handle potential database errors
    console.error(
      `🚨 [getUserSavedAdIds] Error fetching saved ads for user ${userId}:`,
      error,
    );
    // Return an empty array in case of error to avoid breaking the API response
    return [];
  }
};
