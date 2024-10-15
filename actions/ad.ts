"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { AdData } from "@/types/ad";
import { prisma } from "@/lib/db";

// Helper function to extract image URL from ad data
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

export async function saveAd(ad: AdData, collectionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Check if the collection belongs to the user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId: session.user.id,
      },
    });

    if (!collection) {
      return {
        success: false,
        message: "Collection not found or doesn't belong to the user",
      };
    }

    // Check if the ad is already saved in this collection
    const existingAd = await prisma.savedAd.findFirst({
      where: {
        ad_archive_id: ad.ad_archive_id,
        collectionId: collectionId,
      },
    });

    if (existingAd) {
      return {
        success: false,
        message: "Ad already exists in this collection",
      };
    }

    // Extract image URL from ad data
    const imageUrl = extractImageFromAd(ad);

    // Save the ad
    await prisma.savedAd.create({
      data: {
        ad_archive_id: ad.ad_archive_id,
        collectionId: collectionId,
        adData: ad as any,
        imageUrl: imageUrl,
        collation_id: ad.collation_id,
      },
    });

    // Update the collection's savedAdsCount, lastSavedAt, and imageUrl if it's the first ad
    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        savedAdsCount: { increment: 1 },
        lastSavedAt: new Date(),
        imageUrl: collection.savedAdsCount === 0 ? imageUrl : undefined,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/collections");
    return { success: true, message: "Ad saved successfully" };
  } catch (error) {
    console.error("Failed to save ad:", error);
    return { success: false, message: "Failed to save ad" };
  }
}

export async function unsaveAd(adArchiveId: string, collectionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    // Check if the collection belongs to the user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId: session.user.id,
      },
      include: {
        savedAds: {
          orderBy: { createdAt: "desc" },
          take: 2, // Fetch the to-be-deleted ad and the potential new latest ad
        },
      },
    });

    if (!collection) {
      throw new Error("Collection not found or doesn't belong to the user");
    }

    // Find and delete the saved ad
    const deletedAd = await prisma.savedAd.deleteMany({
      where: {
        ad_archive_id: adArchiveId,
        collectionId: collectionId,
      },
    });

    if (deletedAd.count === 0) {
      return { success: false, message: "Ad not found in this collection" };
    }

    // Determine the new imageUrl for the collection
    let newImageUrl: string | null = null;
    if (
      collection.savedAds[0].ad_archive_id === adArchiveId &&
      collection.savedAds.length > 1
    ) {
      // If the deleted ad was the latest, use the image from the next latest ad
      newImageUrl = collection.savedAds[1].imageUrl;
    } else if (collection.savedAds.length === 1) {
      // If this was the last ad, set imageUrl to null
      newImageUrl = null;
    }

    // Update the collection's savedAdsCount, lastSavedAt, and potentially imageUrl
    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        savedAdsCount: { decrement: 1 },
        lastSavedAt: new Date(),
        imageUrl: newImageUrl,
      },
    });

    revalidatePath("/collections");
    return { success: true, message: "Ad unsaved successfully" };
  } catch (error) {
    console.error("Failed to unsave ad:", error);
    throw new Error("Failed to unsave ad");
  }
}

export async function checkAdSaveStatus(adArchiveId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const savedAds = await prisma.savedAd.findMany({
      where: {
        ad_archive_id: adArchiveId,
        collection: {
          userId: session.user.id,
        },
      },
      select: {
        collectionId: true,
      },
    });

    const isSaved = savedAds.length > 0;
    const savedCollectionIds = savedAds.map((ad) => ad.collectionId);

    return { isSaved, savedCollectionIds };
  } catch (error) {
    console.error("Failed to check ad save status:", error);
    throw new Error("Failed to check ad save status");
  }
}
