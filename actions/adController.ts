// @/actions/adController.ts
"use server";

import { Prisma } from "@prisma/client";

import { AdData } from "@/types/ad";
import { prisma } from "@/lib/db";
import {
  deleteMultipleMediaFromR2,
  extractR2KeysFromAdData,
  processAdMediaForR2,
} from "@/lib/r2";

// ============================================================================
// 📑 TYPES & INTERFACES
// ============================================================================

export type FetchAdsParams = {
  page: number;
  limit: number;
  search?: string;
  pageName?: string;
  domain?: string;
  pageCategory?: string;
  countries?: string[];
  platforms?: string[];
  displayFormats?: string[];
  ctaTypes?: string[];
  minCollation?: number;
  maxCollation?: number;
  startDateMin?: string;
  startDateMax?: string;
};

// ============================================================================
// 🛠️ INTERNAL HELPERS (Not exported to keep Server Actions secure)
// ============================================================================

/**
 * Extracts a clean domain (e.g., "dine.co.nz") from a full URL.
 */
function extractDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    if (hostname.startsWith("www.")) hostname = hostname.slice(4);
    return hostname;
  } catch {
    return null;
  }
}

/**
 * Parses raw Meta Ad JSON into our flattened, optimized database schema.
 */
function parseAdDataToFields(adData: any) {
  const snapshot = adData.snapshot || {};
  const cards = snapshot.cards || [];

  // 1. Stringify Domains
  const rawUrls = [
    snapshot.link_url,
    ...(snapshot.extra_links || []),
    ...cards.map((card: any) => card.link_url),
  ];
  const domainsSet = new Set<string>();
  rawUrls.forEach((url) => {
    const domain = extractDomain(url);
    if (domain) domainsSet.add(domain);
  });
  const domainString = Array.from(domainsSet).join(" ");

  // 2. Stringify Page Categories
  const pageCategoriesArr = Array.isArray(snapshot.page_categories)
    ? snapshot.page_categories
    : Array.isArray(adData.page_categories)
      ? adData.page_categories
      : [];
  const pageCategoryString = pageCategoriesArr.join(" ");

  // 3. Extract CTAs (Arrays for exact checkbox matching)
  const ctaTypesSet = new Set<string>();
  if (snapshot.cta_type) ctaTypesSet.add(snapshot.cta_type);
  cards.forEach((card: any) => {
    if (card.cta_type) ctaTypesSet.add(card.cta_type);
  });

  // 4. Pure Ad Copy Text Content (NO domains, NO categories here)
  const textBlocks = new Set<string>();
  const addText = (text?: string | null) => {
    if (text && typeof text === "string" && text.trim().length > 0) {
      textBlocks.add(text.trim());
    }
  };

  addText(snapshot.body?.text);
  addText(snapshot.title);
  addText(snapshot.caption);
  addText(snapshot.link_description);
  cards.forEach((card: any) => {
    addText(card.body);
    addText(card.title);
    addText(card.caption);
    addText(card.link_description);
  });

  const textContent = Array.from(textBlocks).join("\n\n");

  const startDate = adData.start_date
    ? new Date(adData.start_date * 1000)
    : null;
  const endDate = adData.end_date ? new Date(adData.end_date * 1000) : null;

  return {
    platforms: Array.isArray(adData.publisher_platform)
      ? adData.publisher_platform
      : [],
    startDate,
    endDate,
    displayFormat: snapshot.display_format || null,
    pageName: adData.page_name || snapshot.page_name || null,
    pageId: adData.page_id || snapshot.page_id || null,
    isActive: typeof adData.is_active === "boolean" ? adData.is_active : null,
    collationCount:
      typeof adData.collation_count === "number"
        ? adData.collation_count
        : null,
    ctaTypes: Array.from(ctaTypesSet),
    domain: domainString.length > 0 ? domainString : null,
    pageCategory: pageCategoryString.length > 0 ? pageCategoryString : null,
    textContent: textContent.length > 0 ? textContent : null,
  };
}

/**
 * Converts a text string into an AND condition for Google-style loose searching.
 */
function buildLooseSearchCondition(field: string, text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;

  return {
    AND: words.map((word) => ({
      [field]: { contains: word, mode: "insensitive" },
    })),
  };
}

// ============================================================================
// 📥 1. INGESTION (Extension -> Database)
// ============================================================================

export async function upsertAdRecord(
  ad_archive_id: string,
  rawAdData: any,
  incomingCountry?: string | null,
) {
  try {
    // ✨ Deep copy the raw data to modify it safely
    const adDataToProcess = JSON.parse(JSON.stringify(rawAdData)) as AdData;

    // ✨ Process media (Download from FB -> Upload to R2 -> Replace URLs)
    await processAdMediaForR2(adDataToProcess, ad_archive_id);

    // ✨ Parse extracted fields from the PROCESSED ad data
    const extractedFields = parseAdDataToFields(adDataToProcess);

    let validCountry: string | null = null;
    if (incomingCountry && incomingCountry.toUpperCase() !== "ALL") {
      validCountry = incomingCountry.toUpperCase();
    }

    const existingAd = await prisma.ad.findUnique({
      where: { ad_archive_id },
      select: { countries: true },
    });

    const currentCountries = existingAd?.countries || [];
    const countriesSet = new Set(currentCountries);
    if (validCountry) countriesSet.add(validCountry);

    const updatedCountriesArray = Array.from(countriesSet);

    const ad = await prisma.ad.upsert({
      where: { ad_archive_id },
      update: {
        adData: adDataToProcess as unknown as Prisma.InputJsonValue, // ✨ UPDATE: Use processed data
        countries: updatedCountriesArray,
        ...extractedFields,
      },
      create: {
        ad_archive_id,
        adData: adDataToProcess as unknown as Prisma.InputJsonValue, // ✨ UPDATE: Use processed data
        countries: updatedCountriesArray,
        ...extractedFields,
      },
    });

    return { success: true, adId: ad.id };
  } catch (error) {
    console.error(`🚨 [AdController: upsertAdRecord] Failed:`, error);
    return { success: false, error: "Database operation failed" };
  }
}

// ============================================================================
// 🔍 2. QUERYING (For Ad Archive UI)
// ============================================================================

export async function fetchAdArchive(params: FetchAdsParams) {
  const {
    page,
    limit,
    search,
    pageName,
    domain,
    pageCategory,
    countries,
    platforms,
    displayFormats,
    ctaTypes,
    minCollation,
    maxCollation,
    startDateMin,
    startDateMax,
  } = params;

  try {
    const where: Prisma.AdWhereInput = {};
    const globalAND: Prisma.AdWhereInput[] = [];

    // Loose Text Searches
    if (search) {
      const condition = buildLooseSearchCondition("textContent", search);
      if (condition) globalAND.push(condition);
    }
    if (pageName) {
      const condition = buildLooseSearchCondition("pageName", pageName);
      if (condition) globalAND.push(condition);
    }
    if (domain) {
      const condition = buildLooseSearchCondition("domain", domain);
      if (condition) globalAND.push(condition);
    }
    if (pageCategory) {
      const condition = buildLooseSearchCondition("pageCategory", pageCategory);
      if (condition) globalAND.push(condition);
    }

    if (globalAND.length > 0) {
      where.AND = globalAND;
    }

    // Exact Array Matches
    if (countries && countries.length > 0)
      where.countries = { hasSome: countries };
    if (platforms && platforms.length > 0)
      where.platforms = { hasSome: platforms };
    if (ctaTypes && ctaTypes.length > 0) where.ctaTypes = { hasSome: ctaTypes };
    if (displayFormats && displayFormats.length > 0)
      where.displayFormat = { in: displayFormats };

    // Ranges
    if (minCollation !== undefined || maxCollation !== undefined) {
      where.collationCount = {};
      if (minCollation !== undefined) where.collationCount.gte = minCollation;
      if (maxCollation !== undefined) where.collationCount.lte = maxCollation;
    }
    if (startDateMin || startDateMax) {
      where.startDate = {};
      if (startDateMin)
        where.startDate.gte = new Date(`${startDateMin}T00:00:00.000Z`);
      if (startDateMax)
        where.startDate.lte = new Date(`${startDateMax}T23:59:59.999Z`);
    }

    const skip = (page - 1) * limit;

    const [total, rawAds] = await Promise.all([
      prisma.ad.count({ where }),
      prisma.ad.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: "desc" },
      }),
    ]);

    const ads = rawAds.map((ad) => ({
      id: ad.id,
      adData: ad.adData as unknown as AdData,
    }));

    return {
      ads,
      pagination: { total, pages: Math.ceil(total / limit), current: page },
    };
  } catch (error) {
    console.error("🚨 [AdController: fetchAdArchive] Error:", error);
    return { error: "Failed to fetch archived ads." };
  }
}

// ============================================================================
// ⚙️ 3. MANAGEMENT (For Ad Manager Dashboard)
// ============================================================================

export async function getAdDatabaseStats() {
  try {
    const totalAds = await prisma.ad.count();
    return { success: true, totalAds };
  } catch (error) {
    console.error("🚨 [AdController: getAdDatabaseStats] Error:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function deleteAdByArchiveId(ad_archive_id: string) {
  try {
    // ✨ Fetch the ad first to get its data for R2 key extraction
    const ad = await prisma.ad.findUnique({
      where: { ad_archive_id },
      select: { adData: true },
    });

    if (!ad) return { success: false, error: "Ad not found in database." };

    // ✨ Extract R2 keys from the ad data
    const keysToDelete = extractR2KeysFromAdData(
      ad.adData as unknown as AdData,
    );

    // ✨ Attempt to delete files from R2
    if (keysToDelete.length > 0) {
      console.log(
        `[Delete Global Ad] Attempting R2 deletion for ${keysToDelete.length} keys for ad ${ad_archive_id}...`,
      );
      const r2DeletionSuccess = await deleteMultipleMediaFromR2(keysToDelete);

      if (!r2DeletionSuccess) {
        console.error(
          `🚨 [AdController: deleteAdByArchiveId] R2 deletion partially failed for ad ${ad_archive_id}. Proceeding with DB deletion.`,
        );
      }
    }

    // ✨ Delete the ad from the database
    await prisma.ad.delete({ where: { ad_archive_id } });
    console.log(
      `✅ 🗑️ _ [Delete Global Ad] Successfully deleted ad ${ad_archive_id} from DB.`,
    );

    return {
      success: true,
      message: `Ad ${ad_archive_id} deleted successfully.`,
    };
  } catch (error: any) {
    if (error.code === "P2025") {
      return { success: false, error: "Ad not found in database." };
    }
    console.error("🚨[AdController: deleteAdByArchiveId] Error:", error);
    return { success: false, error: "Failed to delete ad." };
  }
}

export async function inspectAdByArchiveId(ad_archive_id: string) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { ad_archive_id },
      select: {
        adData: true,
        countries: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!ad) return { success: false, error: "Ad not found in database." };
    return { success: true, ad };
  } catch (error) {
    console.error("🚨 [AdController: inspectAdByArchiveId] Error:", error);
    return { success: false, error: "Failed to fetch ad data." };
  }
}
