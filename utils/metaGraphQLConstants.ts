// app/lib/metaGraphQLConstants.ts

export const apiNameToDocId = {
  AdLibraryAdCollationDetailsQuery: "8918149204878948",
  AdLibraryCollationSummaryDetailsAggregateSectionQuery: "4368375336597135",
  AdLibraryAdDetailsV2Query: "8422900291076880",
  AdLibraryMobileFocusedStateProviderRefetchQuery: "7630761763694875",
  AdLibrarySearchPaginationQuery: "8022477101123416",
  AdLibraryFilterContextProviderQuery: "6645028345583352",
  AdLibraryPageHoverCardQuery: "6453683764688391",
  useAdLibraryTypeaheadSuggestionDataSourceQuery: "7801302506625362",
} as const;

export const API_ENDPOINT = "https://www.facebook.com/api/graphql";

export const defaultHeaders = {
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
};

export const defaultParams = {
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
};
