// app/actions/trendAds.ts

"use server";

import { prisma } from "@/lib/db";

const ADS_PER_PAGE = 10;

/**
 * Fetches trend ads based on specified users and collections in the environment variables.
 * @param page The page number to fetch (1-indexed).
 * @returns An object containing the fetched ads and a flag indicating if there are more ads.
 */
export async function getTrendAds(page: number = 1) {
  try {
    const trendUserEmails = process.env.TREND_USER_EMAILS?.split(",") || [];
    const trendCollectionNames =
      process.env.TREND_COLLECTION_NAMES?.split(",") || [];

    if (trendUserEmails.length === 0 || trendCollectionNames.length === 0) {
      console.warn(
        "No trend users or collections specified in environment variables.",
      );
      return { ads: [], hasMore: false };
    }

    const users = await prisma.user.findMany({
      where: { email: { in: trendUserEmails } },
      select: { id: true },
    });

    const collections = await prisma.collection.findMany({
      where: {
        name: { in: trendCollectionNames },
        userId: { in: users.map((user) => user.id) },
      },
      select: { id: true },
    });

    if (collections.length === 0) {
      console.warn(
        "No matching collections found for the specified users and collection names.",
      );
      return { ads: [], hasMore: false };
    }

    const skip = (page - 1) * ADS_PER_PAGE;

    const savedAds = await prisma.savedAd.findMany({
      where: {
        collectionId: { in: collections.map((collection) => collection.id) },
      },
      select: { adData: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: ADS_PER_PAGE + 1, // Fetch one extra to check if there are more
    });

    const hasMore = savedAds.length > ADS_PER_PAGE;
    const ads = savedAds
      .slice(0, ADS_PER_PAGE)
      .map((savedAd) => savedAd.adData);

    return { ads, hasMore };
  } catch (error) {
    console.error("Error fetching trend ads:", error);
    throw new Error("Failed to fetch trend ads");
  }
}
