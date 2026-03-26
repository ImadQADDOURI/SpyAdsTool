// @/components/adLibrary/archive/AdArchive.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchAdArchive, FetchAdsParams } from "@/actions/adController";
import { AD_ARCHIVE_FILTERS, FilterConfig } from "@/configuration/adFilters";
import { Database, Filter, Search, X } from "lucide-react";
import { toast } from "sonner";

import { AdData } from "@/types/ad";
import { ScrollButtons } from "@/components/adTool/sharedComponents/ScrollButtons";

import SearchResults from "./sharedComponents/SearchResults";
import TitleSection from "./sharedComponents/TitleSection";

type PaginationResponse = { total: number; pages: number; current: number };

export default function AdArchive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const [ads, setAds] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationResponse>({
    total: 0,
    pages: 0,
    current: 1,
  });
  const [hasMore, setHasMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState<Record<string, string>>(
    {},
  );

  const todayDateStr = new Date().toISOString().split("T")[0];

  // Separate filters by type for UI organization
  const textFilters = AD_ARCHIVE_FILTERS.filter((f) => f.type === "text");
  const dropdownFilters = AD_ARCHIVE_FILTERS.filter((f) => f.type !== "text");

  // --- Click Outside Handler for native details ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("details.filter-dropdown")) {
        document
          .querySelectorAll("details.filter-dropdown[open]")
          .forEach((el) => {
            el.removeAttribute("open");
          });
      } else {
        const currentDetails = target.closest("details.filter-dropdown");
        document
          .querySelectorAll("details.filter-dropdown[open]")
          .forEach((el) => {
            if (el !== currentDetails) el.removeAttribute("open");
          });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // --- Active Filter Counter ---
  const getActiveFilterCount = (config: FilterConfig): number => {
    if (config.type === "checkbox")
      return searchParams.getAll(config.id).length;
    if (config.type === "number-range" || config.type === "date-range") {
      let count = 0;
      if (searchParams.get(`${config.id}Min`)) count++;
      if (searchParams.get(`${config.id}Max`)) count++;
      return count;
    }
    return 0;
  };

  // --- Data Fetching ---
  const loadAds = useCallback(
    async (page = 1, reset = false, customParams?: URLSearchParams) => {
      const paramsToUse = customParams || searchParams;

      if (reset && paramsToUse.toString() === "") {
        setAds([]);
        setHasSearched(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        const params: FetchAdsParams = {
          page,
          limit: 20,
          search: paramsToUse.get("search") || undefined,
          pageName: paramsToUse.get("pageName") || undefined,
          domain: paramsToUse.get("domain") || undefined,
          pageCategory: paramsToUse.get("pageCategory") || undefined,
          countries: paramsToUse.getAll("countries"),
          platforms: paramsToUse.getAll("platforms"),
          displayFormats: paramsToUse.getAll("displayFormats"),
          ctaTypes: paramsToUse.getAll("ctaTypes"),
          minCollation: paramsToUse.get("collationCountMin")
            ? Number(paramsToUse.get("collationCountMin"))
            : undefined,
          maxCollation: paramsToUse.get("collationCountMax")
            ? Number(paramsToUse.get("collationCountMax"))
            : undefined,
          startDateMin: paramsToUse.get("startDateMin") || undefined,
          startDateMax: paramsToUse.get("startDateMax") || undefined,
        };

        const result = await fetchAdArchive(params);

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result.ads && result.pagination) {
          const extractedAds = result.ads.map((ad) => ad.adData);
          setAds((prev) => (reset ? extractedAds : [...prev, ...extractedAds]));
          setPagination(result.pagination);
          setHasMore(result.pagination.current < result.pagination.pages);
        }
      } catch (error) {
        setError("Failed to load archived ads");
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams],
  );

  useEffect(() => {
    loadAds(1, true);
  }, [searchParams, loadAds]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) loadAds(pagination.current + 1, false);
  }, [isLoading, hasMore, pagination.current, loadAds]);

  // --- Form Handlers ---
  const handleApplyFilters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newParams = new URLSearchParams();

    AD_ARCHIVE_FILTERS.forEach((config) => {
      if (config.type === "text") {
        const val = formData.get(config.id) as string;
        if (val && val.trim()) {
          newParams.set(config.id, val.trim());
        }
      } else if (config.type === "checkbox") {
        const vals = formData.getAll(config.id) as string[];
        vals.forEach((val) => newParams.append(config.id, val));
      } else if (
        config.type === "number-range" ||
        config.type === "date-range"
      ) {
        const minVal = formData.get(`${config.id}Min`) as string;
        const maxVal = formData.get(`${config.id}Max`) as string;
        if (minVal) newParams.set(`${config.id}Min`, minVal);
        if (maxVal) newParams.set(`${config.id}Max`, maxVal);
      }
    });

    // Close any open dropdowns on submit
    document
      .querySelectorAll("details.filter-dropdown")
      .forEach((el) => el.removeAttribute("open"));

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleClearAll = () => {
    if (formRef.current) formRef.current.reset();
    setDropdownSearch({});
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-900">
      <TitleSection
        icon={Database}
        badgeText="Global Archive"
        image={Search}
        imageColor="text-blue-500"
        highlightedText="Ad Master"
        remainingTitle="Database"
        auroraColors={["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]}
      />

      <div className="mx-auto mt-6 w-full px-4 md:px-6">
        {/* --- FILTER PANEL (Static, not sticky) --- */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:p-6">
          <form
            ref={formRef}
            onSubmit={handleApplyFilters}
            className="flex flex-col gap-6"
          >
            {/* 1. EXPOSED TEXT INPUTS GRID */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {textFilters.map((config) => {
                const Icon = config.icon;
                return (
                  <div key={config.id} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={config.id}
                      className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                      {config.label}
                    </label>
                    <input
                      id={config.id}
                      type="text"
                      name={config.id}
                      defaultValue={searchParams.get(config.id) || ""}
                      placeholder={config.placeholder}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm shadow-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:focus:bg-gray-800"
                    />
                  </div>
                );
              })}
            </div>

            {/* 2. ADVANCED DROPDOWN FILTERS & ACTIONS */}
            <div className="flex flex-col justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-700 lg:flex-row lg:items-center">
              {/* Dropdown Group */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="mr-2 flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Filter className="h-4 w-4" /> Attributes:
                </span>

                {dropdownFilters.map((config) => {
                  const Icon = config.icon;
                  const activeCount = getActiveFilterCount(config);
                  const isActive = activeCount > 0;

                  const filterSearchTerm =
                    dropdownSearch[config.id]?.toLowerCase() || "";
                  const visibleOptions = config.options?.filter(
                    (opt) =>
                      opt.label.toLowerCase().includes(filterSearchTerm) ||
                      opt.value.toLowerCase().includes(filterSearchTerm),
                  );

                  return (
                    <details
                      key={config.id}
                      className="filter-dropdown group relative"
                    >
                      <summary
                        className={`flex cursor-pointer select-none list-none items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                          isActive
                            ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {Icon && (
                          <Icon
                            className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
                          />
                        )}
                        {config.label}
                        {isActive && activeCount > 0 && (
                          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                            {activeCount}
                          </span>
                        )}
                      </summary>

                      <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        {config.searchable && (
                          <div className="mb-3">
                            <input
                              type="text"
                              placeholder={`Search ${config.label}...`}
                              value={dropdownSearch[config.id] || ""}
                              onChange={(e) =>
                                setDropdownSearch((prev) => ({
                                  ...prev,
                                  [config.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") e.preventDefault();
                              }}
                              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                            />
                          </div>
                        )}

                        {config.type === "number-range" && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              name={`${config.id}Min`}
                              min="1"
                              placeholder="Min"
                              defaultValue={
                                searchParams.get(`${config.id}Min`) || ""
                              }
                              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                              type="number"
                              name={`${config.id}Max`}
                              min="1"
                              placeholder="Max"
                              defaultValue={
                                searchParams.get(`${config.id}Max`) || ""
                              }
                              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                            />
                          </div>
                        )}

                        {config.type === "date-range" && (
                          <div className="space-y-2">
                            <div>
                              <label className="mb-1 block text-xs text-gray-500">
                                From Date
                              </label>
                              <input
                                type="date"
                                name={`${config.id}Min`}
                                min="2018-05-07"
                                max={todayDateStr}
                                defaultValue={
                                  searchParams.get(`${config.id}Min`) || ""
                                }
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs text-gray-500">
                                To Date
                              </label>
                              <input
                                type="date"
                                name={`${config.id}Max`}
                                min="2018-05-07"
                                max={todayDateStr}
                                defaultValue={
                                  searchParams.get(`${config.id}Max`) || ""
                                }
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                              />
                            </div>
                          </div>
                        )}

                        {config.type === "checkbox" && visibleOptions && (
                          <div className="custom-scrollbar max-h-60 space-y-1 overflow-y-auto pr-1">
                            {visibleOptions.length === 0 ? (
                              <p className="px-2 text-sm italic text-gray-500">
                                No options found.
                              </p>
                            ) : (
                              visibleOptions.map((opt) => (
                                <label
                                  key={opt.value}
                                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <input
                                    type="checkbox"
                                    name={config.id}
                                    value={opt.value}
                                    defaultChecked={searchParams
                                      .getAll(config.id)
                                      .includes(opt.value)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  {opt.icon && (
                                    <Image
                                      src={opt.icon}
                                      alt={opt.label}
                                      width={18}
                                      height={14}
                                      className="rounded-sm border border-gray-200 object-cover shadow-sm"
                                    />
                                  )}
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {opt.label}
                                  </span>
                                </label>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-end gap-3 lg:mt-0">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" /> Clear All
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* --- RESULTS AREA --- */}
        <div className="w-full min-w-0">
          {!hasSearched ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-24 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Database className="mx-auto mb-5 h-14 w-14 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Ready to Search
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-gray-500">
                Fill in your criteria above and click Apply Filters to explore
                the global ad archive.
              </p>
            </div>
          ) : (
            <SearchResults
              isLoading={isLoading && ads.length === 0}
              error={error}
              totalCount={pagination.total}
              searchResults={ads}
              hasNextPage={hasMore}
              remainingCount={
                pagination.total - ads.length > 0
                  ? pagination.total - ads.length
                  : null
              }
              handleLoadMore={handleLoadMore}
            />
          )}
        </div>
      </div>
      <ScrollButtons />
    </div>
  );
}
