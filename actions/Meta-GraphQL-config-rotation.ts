// @/lib/config-rotation.ts
"use server";

import { unstable_cache as cache, revalidateTag } from "next/cache";
import { MetaGraphQLConfig } from "@prisma/client";

import { prisma } from "@/lib/db";

import {
  ACTIVE_CONFIGS_CACHE_TAG,
  ACTIVE_CONFIGS_TTL_SECONDS,
} from "./Meta-GraphQL-cache-config";

// 💾 FETCH AND CACHE ACTIVE CONFIG IDs =======================================
/**
 * @description Fetches and caches the IDs of all active MetaGraphQLConfig entries.
 * Uses Next.js unstable_cache for efficient caching with a specific tag.
 * @returns {Promise<string[]>} A promise resolving to an array of active config IDs.
 */
export const getActiveConfigIds = cache(
  async (): Promise<string[]> => {
    // console.log("🔄 Fetching active GraphQL config IDs from DB..."); // 🪵 Log DB access
    try {
      const activeConfigs = await prisma.metaGraphQLConfig.findMany({
        where: { is_active: true },
        select: { id: true }, // 🚀 Only fetch the ID
      });
      return activeConfigs.map((config) => config.id);
    } catch (error) {
      console.error("💥 Failed to fetch active config IDs:", error);
      return []; // Return empty array on error to prevent breaking selection logic
    }
  },
  [ACTIVE_CONFIGS_CACHE_TAG], // 🔗 Associate with the specific cache tag
  {
    revalidate: ACTIVE_CONFIGS_TTL_SECONDS, // ⏱️ Set cache expiration time
    tags: [ACTIVE_CONFIGS_CACHE_TAG], // 🏷️ Assign the tag for targeted revalidation
  },
);

// 🎲 GET RANDOM CONFIG ID ====================================================
/**
 * @description Retrieves a randomly selected active config ID.
 * Fetches the list of active IDs using the cached `getActiveConfigIds` function.
 * @returns {Promise<string | null>} A promise resolving to a random config ID or null if none are active.
 */
export async function getRandomActiveConfigId(): Promise<string | null> {
  const activeIds = await getActiveConfigIds();

  if (!activeIds || activeIds.length === 0) {
    console.warn("⚠️ No active GraphQL configurations found.");
    return null; // 🤷 No active configs available
  }

  // 🎲 Select a random index
  const randomIndex = Math.floor(Math.random() * activeIds.length);
  const selectedId = activeIds[randomIndex];

  console.log(`🎲 Randomly selected config ID: ${selectedId}`); // 🪵 Log selection
  return selectedId;
}

// 🔄 MANUAL CACHE REFRESH ACTION ============================================
/**
 * @description Server action to manually invalidate the cache for active config IDs.
 * Typically triggered by an admin interface.
 */
export async function refreshActiveConfigsCache() {
  console.log(
    `🔄 Manually revalidating cache tag: ${ACTIVE_CONFIGS_CACHE_TAG}`,
  );
  revalidateTag(ACTIVE_CONFIGS_CACHE_TAG);
  // Optionally, revalidate the base path if needed
  // revalidatePath('/meta-graphql-configs'); // Already done in toggle action
}
