// @/actions/Meta-GraphQL-Queries.ts

import { ReadonlyURLSearchParams } from "next/navigation";
import { metaGraphQLApi } from "@/actions/Meta-GraphQL-Api";

import { AdData } from "@/types/ad";

// Default configuration
export const DEFAULT_GRAPHQL_CONFIG = {
  url: "https://www.facebook.com/api/graphql/",
  headers: {
    X: "DEFAULT_GRAPHQL_CONFIG",
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,fr;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    cookie:
      "datr=OcriZmtZzOtqJKEUX9Zhukco; sb=upzuZjh-bKjXqMoe0VbegPf7; ps_l=1; ps_n=1; usida=eyJ2ZXIiOjEsImlkIjoiQXNreWYwbjFyYnZod3ciLCJ0aW1lIjoxNzI4MjUxMDE1fQ%3D%3D; locale=en_US; c_user=100004554965536; xs=26%3A2yId6bC3XgoRoQ%3A2%3A1736969665%3A-1%3A7027%3A%3AAcUh92sa2bnaIeeBfftv9ZwUKL7Sw7plkhDgNGk0iQ; fr=155NG29rrAigQr7HP.AWU5Dnx4BSn0x-x6K6C5cqm33vM.BniPSd..AAA.0.0.BniPSi.AWU55RIvhEw; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1737028773298%2C%22v%22%3A1%7D; wd=1366x991",
    origin: "https://www.facebook.com",
    priority: "u=1, i",
    referer:
      "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&q=baboon&search_type=keyword_unordered&source=nav-header",
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-full-version-list":
      '"Google Chrome";v="131.0.6778.265", "Chromium";v="131.0.6778.265", "Not_A Brand";v="24.0.0.0"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": '""',
    "sec-ch-ua-platform": '"Windows"',
    "sec-ch-ua-platform-version": '"15.0.0"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "x-asbd-id": "129477",
    "x-fb-friendly-name": "AdLibrarySearchPaginationQuery",
    "x-fb-lsd": "cPZns4iGcGZoQk-6XqH2Dd",
  },
  method: "POST",
  body: {
    av: "100004554965536",
    __aaid: "0",
    __user: "100004554965536",
    __a: "1",
    __req: "1d",
    __hs: "20104.HYP:comet_plat_default_pkg.2.1.0.2.1",
    dpr: "1",
    __ccg: "EXCELLENT",
    __rev: "1019374542",
    __s: "cf17dz:48yyt2:u8uc2e",
    __hsi: "7460481730350467671",
    __dyn:
      "7xeUmxa13yoS1syUbFp432m2q1Dxu13wqovzEdF8ixy360CEbo9E3-xS6Ehw2nVEK12wvk0ie2O1VwBwXwEwgo9oO0iS12x62G3i1ywOwv89k2C1FwaG5E6i588Egz898mwkE-U6-3e4UaEW0KrK2S1qxaawse5o4q0HUkw4BwMzUdEGdwzwea0K-1Lwqp8aE2cwmo6O1Fw5VwtU5K2G0JU",
    __csr: "hYBhKCmiCqjLJpkCjyFTCG8xK2aU2EwxzE8UryU2hxe0r61Gw9O0Oo00Ho903KE",
    __comet_req: "1",
    fb_dtsg:
      "NAcNLiG29MdbeVrxhqo-n7kXoYx3ApergSV9T2GkRrWODuJ7QKzwVow:26:1736969665",
    jazoest: "25659",
    lsd: "cPZns4iGcGZoQk-6XqH2Dd",
    __spin_r: "1019374542",
    __spin_b: "trunk",
    __spin_t: "1737028763",
    __jssesw: "1",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "AdLibrarySearchPaginationQuery",
    variables:
      '{"activeStatus":"ALL","adType":"ALL","bylines":[],"collationToken":"d804de5a-d922-48d2-b3d3-f26f3e1fceb3","contentLanguages":[],"countries":["ALL"],"cursor":"AQHRcg0rbOI7zQYkEU7MWKZN-tDHR1Y3xXtyutth_N8Bl4uUTnHIX0b30jSlyR1XU1fu","excludedIDs":[],"first":30,"isTargetedCountry":false,"location":null,"mediaType":"ALL","multiCountryFilterMode":null,"pageIDs":[],"potentialReachInput":[],"publisherPlatforms":[],"queryString":"baboon","regions":[],"searchType":"KEYWORD_UNORDERED","sessionID":"f16ea488-18fa-4338-add4-f58cd081be9e","sortData":null,"source":"NAV_HEADER","startDate":null,"v":"74b7f1","viewAllPageID":"0"}',
    server_timestamps: "true",
    doc_id: "8983567531734900",
  },
};
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

export const getAdSearchVariables = (
  searchParams: ReadonlyURLSearchParams,
  endCursor: string | null = null,
  page_id?: string,
) => {
  const getParam = (key: string, defaultValue: string) =>
    searchParams.get(key) || defaultValue;
  const getArrayParam = (key: string, defaultValue: string[]) =>
    searchParams.get(key)?.split(",") || defaultValue;

  // If niche_as_keyword is specified, it's added to the queryString and the searchType is set to "KEYWORD_EXACT_PHRASE", regardless of the original searchType value.
  // If niche_as_keyword is not specified but category_as_keyword is, then category_as_keyword is added to the queryString and the searchType is set to "KEYWORD_UNORDERED", regardless of the original searchType value.
  // The queryString is properly combined with commas and spaces.
  // The searchType is adjusted when necessary.
  let queryString = getParam("q", "");
  const nicheAsKeyword = getParam("niche_as_keyword", "");
  const categoryAsKeyword = getParam("category_as_keyword", "");
  let searchType = getParam("search_type", "KEYWORD_UNORDERED");

  if (nicheAsKeyword) {
    queryString = [queryString, nicheAsKeyword].filter(Boolean).join(", ");
    searchType = "KEYWORD_EXACT_PHRASE";
  } else if (categoryAsKeyword) {
    queryString = [queryString, categoryAsKeyword].filter(Boolean).join(", ");
    searchType = "KEYWORD_UNORDERED";
  }

  return {
    activeStatus: getParam("active_status", page_id ? "ALL" : "ACTIVE"),
    adType: getParam("ad_type", "ALL"),
    bylines: [],
    collationToken: null,
    contentLanguages: getArrayParam("content_languages", []),
    countries: getArrayParam("countries", ["ALL"]),
    cursor: endCursor,
    excludedIDs: [],
    first: 30,
    location: null,
    mediaType: getParam("media_type", "ALL"),
    pageIDs: [],
    potentialReachInput: [],
    publisherPlatforms: getArrayParam("publisher_platforms", []),
    queryString,
    regions: [],
    searchType,
    sessionID: "36350c01-dbe2-4778-b84f-b1d1ec03ae57",
    //sessionID: Math.random().toString(36).substring(7),
    //sessionID: default sessionID from metaGraphQLConstants/defaultParams
    sortData: searchParams.get("sort_data") || null,
    source: "NAV_HEADER",
    startDate: (() => {
      const startDate = searchParams.get("start_date");
      const endDate = searchParams.get("end_date");
      return startDate || endDate
        ? { min: startDate || null, max: endDate || null }
        : null;
    })(),
    v: "7218b1",
    viewAllPageID: page_id || "0",
  };
};

export const getAdLibraryMobileVariables = (pageId: string) => {
  return {
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
};

export const getAdLibraryAdCollationVariables = (
  collationID: string,
  forwardCursor: string | null,
  activeStatus: string,
) => {
  return {
    collationGroupID: collationID,
    forwardCursor: forwardCursor || null,
    backwardCursor: null,
    activeStatus: activeStatus || "ALL",
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
};

// variables example: {"adArchiveID":"451740291243640","pageID":"432061063659239","country":"ALL","sessionID":"0162a99e-6971-4fb4-8a57-97c681e3f534","source":"FB_LOGO","isAdNonPolitical":true,"isAdNotAAAEligible":false}
export const getAdLibraryAdDetailsV2Variables = (
  adArchiveID: string,
  pageID: string,
  isAdAAAEligible: boolean,
) => {
  return {
    adArchiveID,
    pageID,
    country: "ALL",
    sessionID: "0162a99e-6971-4fb4-8a57-97c681e3f534",
    source: "FB_LOGO",
    isAdNonPolitical: true,
    isAdNotAAAEligible: !isAdAAAEligible || false,
  };
};

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
  count: number;
  ads: AdData[];
  end_cursor: string | null;
  has_next_page: boolean;
}
interface AdLibraryMobileFocusedStateProviderRefetchQueryResult {
  count: number;
  ads: AdData[];
  end_cursor: string | null;
  has_next_page: boolean;
  page_info: any;
  page: any;
}

// Function to fetch ad collation details
// variables example: {"collationGroupID":"1247580993346891","forwardCursor":null,"backwardCursor":null,"activeStatus":"ALL","adType":"ALL","bylines":[],"countries":null,"location":null,"potentialReach":[],"publisherPlatforms":[],"regions":[],"sessionID":"ca227fe6-a7d7-431f-a8a2-94d2e69d7da8","startDate":null}
export async function AdLibraryAdCollationDetailsQuery(
  variables: Record<string, any>,
): Promise<AdLibraryAdCollationDetailsQueryResult> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibraryAdCollationDetailsQuery",
    });

    // console.log("🚀🚀🚀🚀 - result ", result);
    // Extract the relevant data from the result
    const collationResults = result.data?.ad_library_main?.collation_results;

    if (!collationResults) {
      throw new Error("Unexpected response structure");
    }
    console.log("🚀🚀🚀🚀 - AdLibraryAdCollationDetailsQuery ");
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
  variables: Record<string, any>,
): Promise<AdLibraryAdDetailsV2QueryResult> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name: "AdLibraryAdDetailsV2Query",
    });

    // Extract the relevant data from the result
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
export async function AdLibrarySearchPaginationQuery(
  variables: Record<string, any>,
): Promise<AdLibrarySearchPaginationQueryResult> {
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

    const count = searchResultsConnection.count;
    const pageInfo = searchResultsConnection.page_info;
    const edges = searchResultsConnection.edges;

    // Extract and flatten ads from all nodes and their collated_results
    const ads = edges.flatMap((edge) =>
      edge.node.collated_results.flatMap((result) => result),
    );

    console.log("🚀🚀🚀🚀 - AdLibrarySearchPaginationQuery ");

    return {
      count,
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
  variables: Record<string, any>,
): Promise<AdLibraryMobileFocusedStateProviderRefetchQueryResult> {
  try {
    const result = await metaGraphQLApi({
      variables,
      fb_api_req_friendly_name:
        "AdLibraryMobileFocusedStateProviderRefetchQuery",
    });

    // Ensure we have the second JSON object
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

    // Extract and flatten ads from all edges and their collated_results
    const ads = searchResultsConnection.edges.flatMap((edge: any) =>
      edge.node.collated_results.flatMap((result: AdData) => result),
    );

    console.log("🚀🚀🚀🚀 - AdLibraryMobileFocusedStateProviderRefetchQuery ");

    return {
      count: searchResultsConnection.count,
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
