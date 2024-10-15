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
    await prisma.$transaction(async (tx) => {
      // Check if the collection belongs to the user
      const collection = await tx.collection.findFirst({
        where: {
          id: collectionId,
          userId: session.user.id,
        },
      });

      if (!collection) {
        throw new Error("Collection not found or doesn't belong to the user");
      }

      // Check if the ad is already saved in this collection
      const existingAd = await tx.savedAd.findFirst({
        where: {
          ad_archive_id: ad.ad_archive_id,
          collectionId: collectionId,
        },
      });

      if (existingAd) {
        return {
          success: true,
          message: "Ad already saved in this collection",
        };
      }

      // Extract image URL from ad data
      const imageUrl = extractImageFromAd(ad);

      // Save the ad
      await tx.savedAd.create({
        data: {
          ad_archive_id: ad.ad_archive_id,
          collectionId: collectionId,
          adData: ad as any,
          imageUrl: imageUrl,
          collation_id: ad.collation_id,
        },
      });

      // Update the collection's savedAdsCount, lastSavedAt, and imageUrl if it's the first ad
      await tx.collection.update({
        where: { id: collectionId },
        data: {
          savedAdsCount: { increment: 1 },
          lastSavedAt: new Date(),
          imageUrl: collection.savedAdsCount === 0 ? imageUrl : undefined,
        },
      });
    });

    revalidatePath("/collections");
    return { success: true, message: "Ad saved successfully" };
  } catch (error) {
    console.error("Failed to save ad:", error);
    throw new Error("Failed to save ad");
  }
}

export async function unsaveAd(adArchiveId: string, collectionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Check if the collection belongs to the user
      const collection = await tx.collection.findFirst({
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

      // Remove the ad from the collection
      await tx.savedAd.delete({
        where: {
          ad_archive_id_collectionId: {
            ad_archive_id: adArchiveId,
            collectionId: collectionId,
          },
        },
      });

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
      await tx.collection.update({
        where: { id: collectionId },
        data: {
          savedAdsCount: { decrement: 1 },
          lastSavedAt: new Date(),
          imageUrl: newImageUrl,
        },
      });
    });

    revalidatePath("/collections");
    return { success: true, message: "Ad unsaved successfully" };
  } catch (error) {
    console.error("Failed to unsave ad:", error);
    throw new Error("Failed to unsave ad");
  }
}

export async function moveAllAds(
  sourceCollectionId: string,
  destinationCollectionId: string,
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Get all ads from the source collection
      const sourceAds = await tx.savedAd.findMany({
        where: { collectionId: sourceCollectionId },
      });

      // Get all ad_archive_ids from the destination collection
      const destinationAdIds = new Set(
        (
          await tx.savedAd.findMany({
            where: { collectionId: destinationCollectionId },
            select: { ad_archive_id: true },
          })
        ).map((ad) => ad.ad_archive_id),
      );

      let movedAdsCount = 0;
      let latestAdImageUrl: string | null = null;

      // Move non-duplicate ads to the destination collection
      for (const ad of sourceAds) {
        if (!destinationAdIds.has(ad.ad_archive_id)) {
          await tx.savedAd.update({
            where: {
              ad_archive_id_collectionId: {
                ad_archive_id: ad.ad_archive_id,
                collectionId: sourceCollectionId,
              },
            },
            data: { collectionId: destinationCollectionId },
          });
          movedAdsCount++;
          latestAdImageUrl = ad.imageUrl || latestAdImageUrl;
        } else {
          // Delete duplicate ads from the source collection
          await tx.savedAd.delete({
            where: {
              ad_archive_id_collectionId: {
                ad_archive_id: ad.ad_archive_id,
                collectionId: sourceCollectionId,
              },
            },
          });
        }
      }

      // Update source collection
      await tx.collection.update({
        where: { id: sourceCollectionId },
        data: {
          savedAdsCount: 0,
          lastSavedAt: new Date(),
          imageUrl: null, // Clear image URL as all ads are moved/deleted
        },
      });

      // Update destination collection
      const destinationCollection = await tx.collection.findUnique({
        where: { id: destinationCollectionId },
        select: { savedAdsCount: true, imageUrl: true },
      });

      await tx.collection.update({
        where: { id: destinationCollectionId },
        data: {
          savedAdsCount:
            (destinationCollection?.savedAdsCount || 0) + movedAdsCount,
          lastSavedAt: new Date(),
          imageUrl: destinationCollection?.imageUrl || latestAdImageUrl, // Use existing image URL if available, otherwise use the latest moved ad's image
        },
      });
    });

    revalidatePath("/collections");
    return { success: true, message: "Ads moved successfully" };
  } catch (error) {
    console.error("Failed to move ads:", error);
    throw new Error("Failed to move ads");
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
