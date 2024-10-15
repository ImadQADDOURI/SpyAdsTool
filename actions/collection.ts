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

      // Move non-duplicate ads to the destination collection
      for (const ad of sourceAds) {
        await tx.savedAd.upsert({
          where: {
            ad_archive_id_collectionId: {
              ad_archive_id: ad.ad_archive_id,
              collectionId: destinationCollectionId,
            },
          },
          update: {}, // If it exists, do nothing
          create: {
            ad_archive_id: ad.ad_archive_id,
            collectionId: destinationCollectionId,
            adData: ad.adData as any,
            imageUrl: ad.imageUrl,
            collation_id: ad.collation_id,
          },
        });

        // Delete the ad from the source collection
        await tx.savedAd.delete({
          where: {
            ad_archive_id_collectionId: {
              ad_archive_id: ad.ad_archive_id,
              collectionId: sourceCollectionId,
            },
          },
        });
      }

      // Update source collection
      await tx.collection.update({
        where: { id: sourceCollectionId },
        data: {
          savedAdsCount: 0,
          lastSavedAt: new Date(),
          imageUrl: null,
          updatedAt: new Date(),
        },
      });

      // Update destination collection
      const destinationAdsCount = await tx.savedAd.count({
        where: { collectionId: destinationCollectionId },
      });

      const latestAd = await tx.savedAd.findFirst({
        where: { collectionId: destinationCollectionId },
        orderBy: { createdAt: "desc" },
        select: { imageUrl: true },
      });

      await tx.collection.update({
        where: { id: destinationCollectionId },
        data: {
          savedAdsCount: destinationAdsCount,
          lastSavedAt: new Date(),
          imageUrl: latestAd?.imageUrl || null,
          updatedAt: new Date(),
        },
      });
    });

    revalidatePath("/collections");
    return { success: true, message: "Ads moved successfully" };
  } catch (error) {
    console.error("Failed to move ads:", error);
    return { success: false, message: "Failed to move ads" };
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
