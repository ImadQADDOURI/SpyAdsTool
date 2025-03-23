// savedAds.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AdData } from "@/types/ad";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// 🎯 Helper function to extract image URL from ad data
function extractImageFromAd(adData: AdData): string | undefined {
  const snapshot = adData.snapshot;
  if (!snapshot) return undefined;
  const cards = snapshot.cards ?? [];
  const images = snapshot.images ?? [];
  const videos = snapshot.videos ?? [];
  const mediaItems = [...cards, ...images, ...videos];
  for (const item of mediaItems) {
    if (item.resized_image_url) {
      return item.resized_image_url;
    }
    if (item.video_preview_image_url) {
      return item.video_preview_image_url;
    }
  }
  return undefined;
}

// 💾 Save ad to a user's board
export async function saveAdToBoard(
  ad_archive_id: string,
  board: string,
  adData: AdData,
) {
  try {
    // 🔐 Authenticate user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { error: "Unauthorized" };
    }

    // 📝 Validate inputs
    if (!ad_archive_id || !board) {
      return { error: "Missing required fields" };
    }

    // 🖼️ Extract image URL
    const imageUrl = extractImageFromAd(adData);

    // 🔍 Check if ad already exists in the board
    const existingAd = await prisma.savedAd.findFirst({
      where: {
        userId: user.id,
        ad_archive_id,
        board,
      },
    });

    if (existingAd) {
      // ✏️ Update existing ad with latest data
      await prisma.savedAd.update({
        where: { id: existingAd.id },
        data: {
          adData: JSON.parse(JSON.stringify(adData)),
          imageUrl,
          updatedAt: new Date(),
        },
      });
    } else {
      // ➕ Create new saved ad
      await prisma.savedAd.create({
        data: {
          ad_archive_id,
          board,
          adData: JSON.parse(JSON.stringify(adData)),
          imageUrl,
          userId: user.id,
        },
      });
    }

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to save ad:", error);
    return { error: "Failed to save ad" };
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
