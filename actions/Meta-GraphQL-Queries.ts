// @/actions/Meta-GraphQL-Queries.ts

import { metaGraphQLApi } from "@/actions/Meta-GraphQL-Api";

import { AdData } from "@/types/ad";
import { SearchParams } from "@/components/adTool/search/filter-config";

// API name to doc_id mapping
export const apiNameToDocId = {
  AdLibraryAdCollationDetailsQuery: "8918149204878948",
  AdLibraryCollationSummaryDetailsAggregateSectionQuery: "4368375336597135",
  AdLibraryAdDetailsV2Query: "8422900291076880",
  AdLibraryMobileFocusedStateProviderRefetchQuery: "7630761763694875",
  AdLibrarySearchPaginationQuery: "8022477101123416",
  AdLibraryFilterContextProviderQuery: "6645028345583352",
  AdLibraryPageHoverCardQuery: "6453683764688391",
  useAdLibraryTypeaheadSuggestionDataSourceQuery: "7801302506625362",
};

// Types
interface AdLibraryAdCollationDetailsQueryResult {
  ads: AdData[];
  forward_cursor: string | null;
  total_count: number;
  is_complete: boolean;
}

interface AdLibraryAdDetailsV2QueryResult {
  gender_audience: string | null;
  age_audience: { min: number; max: number } | null;
  eu_total_reach: number | null;
  age_country_gender_reach_breakdown: any;
}

interface AdLibrarySearchPaginationQueryResult {
  total_count: number;
  search_count: number;
  ads: AdData[];
  end_cursor: string | null;
  has_next_page: boolean;
}

interface AdLibraryMobileFocusedStateProviderRefetchQueryResult {
  total_count: number;
  search_count: number;
  ads: AdData[];
  end_cursor: string | null;
  has_next_page: boolean;
  page_info: any;
  page: any;
}

// 🗂️ Define the shape of the GraphQL edge
interface Edge {
  node: {
    collated_results?: AdData[];
  };
}

// ✨ Helper: Extract and collate Ads from edges
export const extractCollatedAds = (edges: Edge[]): AdData[] =>
  edges
    .map((edge) => edge.node.collated_results ?? []) // 🛠️ Get each group or fallback to []
    .filter((group) => group.length > 0) // 🚫 Remove empty groups
    .map((group) => {
      // 📏 Calculate how many ads in this group
      const groupCount = group.length;

      // 🔍 Find the maximum original collation_count among ads
      const maxOriginal = group.reduce(
        (max, ad) => Math.max(max, ad.collation_count ?? 0),
        0,
      );

      // 🎚️ Determine final collation_count (at least 1)
      const collation_count = Math.max(maxOriginal, groupCount, 1);

      // 📌 Pick the first Ad and override its count
      const [firstAd] = group;
      return { ...firstAd, collation_count };
    });

// Function to extract query parameters from URLSearchParams
export const extractQueryParams = (
  searchParams: URLSearchParams,
): SearchParams => {
  return {
    q: searchParams.get("q") || undefined,
    category_as_keyword: searchParams.get("category_as_keyword") || undefined,
    search_type: searchParams.get("search_type") || undefined,
    active_status: searchParams.get("active_status") || undefined,
    ad_type: searchParams.get("ad_type") || undefined,
    content_languages: searchParams.get("content_languages")
      ? searchParams.get("content_languages")!.split(",")
      : undefined,
    countries: searchParams.get("countries")
      ? searchParams.get("countries")!.split(",")
      : undefined,
    media_type: searchParams.get("media_type") || undefined,
    publisher_platforms: searchParams.get("publisher_platforms")
      ? searchParams.get("publisher_platforms")!.split(",")
      : undefined,
    sort_data: searchParams.get("sort_data") ?? null,
    start_date: searchParams.get("start_date") ?? null,
    end_date: searchParams.get("end_date") ?? null,
  };
};

// Function to fetch ad collation details
// variables example: {"collationGroupID":"1247580993346891","forwardCursor":null,"backwardCursor":null,"activeStatus":"ALL","adType":"ALL","bylines":[],"countries":null,"location":null,"potentialReach":[],"publisherPlatforms":[],"regions":[],"sessionID":"ca227fe6-a7d7-431f-a8a2-94d2e69d7da8","startDate":null}
export async function AdLibraryAdCollationDetailsQuery(
  collationID: string,
  forwardCursor: string | null = null,
): Promise<AdLibraryAdCollationDetailsQueryResult> {
  const variables = {
    collationGroupID: collationID,
    forwardCursor: forwardCursor || null,
    backwardCursor: null,
    activeStatus: "ALL",
    adType: "ALL",
    bylines: [],
    countries: null,
    location: null,
    potentialReach: [],
    publisherPlatforms: [],
    regions: [],
    sessionID: "ca227fe6-a7d7-431f-a8a2-94d2e69d7da8",
    startDate: null,
  };

  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibraryAdCollationDetailsQuery",
    });

    const collationResults = result.data?.ad_library_main?.collation_results;

    if (!collationResults) {
      throw new Error("Unexpected response structure");
    }

    console.log(
      "🚀🚀🚀🚀 - AdLibraryAdCollationDetailsQuery ",
      collationResults.ad_cards.length,
    );

    return {
      ads: collationResults.ad_cards || [],
      forward_cursor: collationResults.forward_cursor,
      total_count: collationResults.total_count,
      is_complete: collationResults.is_complete,
    };
  } catch (error) {
    console.error("Error in AdLibraryAdCollationDetailsQuery:", error);
    throw error;
  }
}

// Function to fetch European Union Ad Details
// variables example: {"adArchiveID":"451740291243640","pageID":"432061063659239","country":"ALL","sessionID":"0162a99e-6971-4fb4-8a57-97c681e3f534","source":"FB_LOGO","isAdNonPolitical":true,"isAdNotAAAEligible":false}
export async function AdLibraryAdDetailsV2Query(
  adArchiveID: string,
  pageID: string,
  isAdAAAEligible: boolean = false,
): Promise<AdLibraryAdDetailsV2QueryResult> {
  const variables = {
    adArchiveID,
    pageID,
    country: "ALL",
    sessionID: "0162a99e-6971-4fb4-8a57-97c681e3f534",
    source: "FB_LOGO",
    isAdNonPolitical: true,
    isAdNotAAAEligible: !isAdAAAEligible || false,
  };

  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibraryAdDetailsV2Query",
    });

    const aaaInfo = result.data?.ad_library_main?.ad_details?.aaa_info;

    if (!aaaInfo) {
      throw new Error("Unexpected response structure");
    }

    console.log("🚀🚀🚀🚀 - AdLibraryAdDetailsV2Query ");

    return {
      gender_audience: aaaInfo.gender_audience,
      age_audience: aaaInfo.age_audience,
      eu_total_reach: aaaInfo.eu_total_reach,
      age_country_gender_reach_breakdown:
        aaaInfo.age_country_gender_reach_breakdown,
    };
  } catch (error) {
    console.error("Error in AdLibraryAdDetailsV2Query:", error);
    throw error;
  }
}

// Function to fetch ads by filter by pageID
// variables example normal Search   0 filters: {"activeStatus":"ALL","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":[],"countries":["ALL"],"cursor":"AQHR3E1VCNfnSwNk8uwi9rTjdrwGnsWl-GUN8FnIeRu1Xi_iKJWM5JIAFNrxvS3cmChA","excludedIDs":[],"first":30,"location":null,"mediaType":"ALL","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"cat","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"6f643586-6dae-4e72-bcb5-779de1d6815b","sortData":null,"source":"NAV_HEADER","startDate":null,"v":"7218b1","viewAllPageID":"0"}
// variables example normal Search All filters: {"activeStatus":"INACTIVE","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":["en","zh"],"countries":["ALL"],"cursor":"AQHR1YeuZJ1CH2ok6BxPdMO-DGPfDxJ7AyVR-1GOgZhONm1uzUeHEEPikE4VniBM5h68","excludedIDs":[],"first":30,"location":null,"mediaType":"VIDEO","pageIDs":["110757928736038","375132235684804","107180365516103","108498844313651","112869771908331","144939265372419"],"potentialReachInput":[],"publisherPlatforms":["FACEBOOK","INSTAGRAM","AUDIENCE_NETWORK","MESSENGER"],"queryString":"cat","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"6f643586-6dae-4e72-bcb5-779de1d6815b","sortData":null,"source":"NAV_HEADER","startDate":{"max":"2024-09-22","min":"2018-05-07"},"v":"7218b1","viewAllPageID":"0"}
// variables example PageID search: {"activeStatus":"ACTIVE","adType":"ALL","bylines":[],"collationToken":null,"contentLanguages":null,"countries":["ALL"],"cursor":"AQHRcbL35kOZB3k1ZkVnc8vKTRR5GblNrFy4KxgiGv5ffJ_stE6kuWziroOxBL0JIrN8","excludedIDs":null,"first":30,"location":null,"mediaType":"all","pageIDs":null,"potentialReachInput":null,"publisherPlatforms":null,"queryString":"","regions":null,"searchType":null,"sessionID":null,"sortData":null,"source":null,"startDate":null,"v":"f67402","viewAllPageID":"602563393163238"}

// 🚀 Main: Perform the GraphQL query and use extractor
export async function AdLibrarySearchPaginationQuery(
  q?: string,
  category_as_keyword?: string,
  search_type?: string,
  active_status?: string,
  ad_type?: string,
  content_languages?: string[],
  countries?: string[],
  media_type?: string,
  publisher_platforms?: string[],
  sort_data?: string | null,
  start_date?: string | null,
  end_date?: string | null,
  endCursor: string | null = null,
  pageId: string = "0",
): Promise<AdLibrarySearchPaginationQueryResult> {
  // Build query string
  let queryString = q || "";
  const categoryAsKeyword = category_as_keyword || "";
  queryString = [queryString, categoryAsKeyword].filter(Boolean).join(", ");

  // Process date range
  const startDate = (() => {
    const startDateParam = start_date;
    let endDateParam = end_date;

    if (endDateParam) {
      const updatedDate = new Date(endDateParam);
      updatedDate.setDate(updatedDate.getDate() + 1);
      endDateParam = updatedDate.toISOString().split("T")[0];
    }

    return startDateParam || endDateParam
      ? { min: startDateParam || null, max: endDateParam || null }
      : null;
  })();

  const variables = {
    activeStatus: active_status || "ACTIVE",
    adType: ad_type || "ALL",
    bylines: [],
    collationToken: null,
    contentLanguages: content_languages || [],
    countries: countries || ["ALL"],
    cursor: endCursor,
    excludedIDs: [],
    first: 30,
    location: null,
    mediaType: media_type || "ALL",
    pageIDs: [],
    potentialReachInput: [],
    publisherPlatforms: publisher_platforms || [],
    queryString,
    regions: [],
    searchType: search_type || "KEYWORD_UNORDERED",
    sessionID: "36350c01-dbe2-4778-b84f-b1d1ec03ae57",
    sortData: sort_data || null,
    source: "NAV_HEADER",
    startDate,
    v: "7218b1",
    viewAllPageID: pageId,
  };

  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
    });

    const searchResultsConnection =
      result.data?.ad_library_main?.search_results_connection;

    if (!searchResultsConnection) {
      throw new Error("Unexpected response structure");
    }

    const total_count = searchResultsConnection.count;
    const pageInfo = searchResultsConnection.page_info;
    const edges = searchResultsConnection.edges;
    // Calculate the number of ads returned in the search results
    const search_count = edges.reduce(
      (sum, edge) =>
        sum +
        (edge.node.collated_results ? edge.node.collated_results.length : 0),
      0,
    );

    const ads = extractCollatedAds(edges);

    console.log(
      "🚀🚀🚀🚀 - AdLibrarySearchPaginationQuery - total_count: " +
        total_count +
        " search_count: " +
        search_count,
    );

    return {
      total_count,
      search_count,
      ads,
      end_cursor: pageInfo.end_cursor,
      has_next_page: pageInfo.has_next_page,
    };
  } catch (error) {
    console.error("Error in AdLibrarySearchPaginationQuery:", error);
    throw error;
  }
}

// Function to fetch Page ID Info with Page Ads
// variables example   0 Filters: {"activeStatus":"ALL","adType":"ALL","audienceTimeframe":"LAST_7_DAYS","bylines":[],"collationToken":"4c63fadb-145f-428f-9696-7e1824245ee8","contentLanguages":[],"countries":["ALL"],"country":"ALL","excludedIDs":[],"fetchPageInfo":true,"fetchSharedDisclaimers":true,"location":null,"mediaType":"ALL","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"","regions":[],"searchType":"PAGE","sessionID":"d9c83232-8090-4de2-b3c5-b66c6cd7a137","sortData":null,"source":null,"startDate":null,"v":"eab698","viewAllPageID":"150008058381451"}
// variables example All Filters: {"activeStatus":"ACTIVE","adType":"ALL","audienceTimeframe":"LAST_7_DAYS","bylines":[],"collationToken":"08609c11-12c6-401e-8bcb-2b56b333b9c5","contentLanguages":["en","fr"],"countries":["ALL"],"country":"ALL","excludedIDs":[],"fetchPageInfo":true,"fetchSharedDisclaimers":true,"location":null,"mediaType":"VIDEO","pageIDs":[],"potentialReachInput":[],"publisherPlatforms":["FACEBOOK","INSTAGRAM"],"queryString":"","regions":[],"searchType":"PAGE","sessionID":"d9c83232-8090-4de2-b3c5-b66c6cd7a137","sortData":null,"source":null,"startDate":{"min":"2018-05-07","max":"2024-10-05"},"v":"eab698","viewAllPageID":"150008058381451"}
export async function AdLibraryMobileFocusedStateProviderRefetchQuery(
  pageId: string,
): Promise<AdLibraryMobileFocusedStateProviderRefetchQueryResult> {
  const variables = {
    activeStatus: "ALL",
    adType: "ALL",
    audienceTimeframe: "LAST_7_DAYS",
    bylines: [],
    collationToken: null,
    contentLanguages: [],
    countries: ["ALL"],
    country: "ALL",
    excludedIDs: [],
    fetchPageInfo: true,
    fetchSharedDisclaimers: true,
    location: null,
    mediaType: "ALL",
    pageIDs: [],
    potentialReachInput: [],
    publisherPlatforms: [],
    queryString: "",
    regions: [],
    searchType: "PAGE",
    sessionID: "d9c83232-8090-4de2-b3c5-b66c6cd7a137",
    sortData: null,
    source: null,
    startDate: null,
    v: "eab698",
    viewAllPageID: pageId,
  };

  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name:
        "AdLibraryMobileFocusedStateProviderRefetchQuery",
    });

    if (!Array.isArray(result) || result.length < 2) {
      throw new Error("Unexpected response structure");
    }

    const data = result[1].data;

    if (!data || !data.ad_library_main) {
      throw new Error("Unexpected data structure in response");
    }

    const searchResultsConnection =
      data.ad_library_main.search_results_connection;
    const pageInfo = searchResultsConnection.page_info;
    const edges = searchResultsConnection.edges;
    // Calculate the number of ads returned in the search results
    const search_count = edges.reduce(
      (sum, edge) =>
        sum +
        (edge.node.collated_results ? edge.node.collated_results.length : 0),
      0,
    );

    const ads = extractCollatedAds(edges);

    console.log(
      "🚀🚀🚀🚀 - AdLibraryMobileFocusedStateProviderRefetchQuery - total_count: " +
        searchResultsConnection.count +
        " search_count: " +
        search_count,
    );

    return {
      total_count: searchResultsConnection.count,
      search_count,
      ads,
      end_cursor: pageInfo.end_cursor,
      has_next_page: pageInfo.has_next_page,
      page_info: data.ad_library_page_info.page_info,
      page: data.page,
    };
  } catch (error) {
    console.error(
      "Error in AdLibraryMobileFocusedStateProviderRefetchQuery:",
      error,
    );
    throw error;
  }
}
