"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function createCollection(name: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const collection = await prisma.collection.create({
      data: {
        name,
        userId: session.user.id,
        // Initialize with default values
        savedAdsCount: 0,
        lastSavedAt: new Date(),
        imageUrl: null, // No image for a new, empty collection
      },
    });

    revalidatePath("/collections");
    return collection;
  } catch (error) {
    console.error("Failed to create collection:", error);
    throw new Error("Failed to create collection");
  }
}

export async function renameCollection(id: string, newName: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const collection = await prisma.collection.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name: newName,
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });

    revalidatePath("/collections");
    return collection;
  } catch (error) {
    console.error("Failed to rename collection:", error);
    throw new Error("Failed to rename collection");
  }
}

export async function deleteCollection(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    await prisma.collection.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/collections");
  } catch (error) {
    console.error("Failed to delete collection:", error);
    throw new Error("Failed to delete collection");
  }
}

export async function getUserCollections() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        savedAds: {
          select: {
            adData: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Sort by most recently updated
      },
    });

    return collections;
  } catch (error) {
    console.error("Failed to fetch user collections:", error);
    throw new Error("Failed to fetch user collections");
  }
}

export async function getCollectionById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        savedAds: {
          select: {
            adData: true,
          },
        },
      },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    return collection;
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    throw new Error("Failed to fetch collection");
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
        orderBy: { createdAt: "desc" },
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
          if (!latestAdImageUrl) latestAdImageUrl = ad.imageUrl;
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
          updatedAt: new Date(),
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
          updatedAt: new Date(),
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

// New function to update collection image URL
export async function updateCollectionImageUrl(collectionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  try {
    const latestAd = await prisma.savedAd.findFirst({
      where: { collectionId: collectionId },
      orderBy: { createdAt: "desc" },
      select: { imageUrl: true },
    });

    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        imageUrl: latestAd?.imageUrl || null,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/collections");
    return {
      success: true,
      message: "Collection image URL updated successfully",
    };
  } catch (error) {
    console.error("Failed to update collection image URL:", error);
    throw new Error("Failed to update collection image URL");
  }
}
