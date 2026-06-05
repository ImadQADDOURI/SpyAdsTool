// @/components/adTool/search/SearchFilters.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GlobalFilterConfig } from "@/configuration/globalFilters";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface SearchFiltersProps {
  isLoading: boolean;
  filters: GlobalFilterConfig[]; // 🚀 The universal configuration array
  onSearch: (params: URLSearchParams) => void;
}

export default function SearchFilters({
  isLoading,
  filters,
  onSearch,
}: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const [dropdownSearch, setDropdownSearch] = useState<Record<string, string>>(
    {},
  );
  const todayDateStr = new Date().toISOString().split("T")[0];

  const textFilters = filters.filter((f) => f.type === "text");
  const dropdownFilters = filters.filter((f) => f.type !== "text");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("details.universal-filter-dropdown")) {
        document
          .querySelectorAll("details.universal-filter-dropdown[open]")
          .forEach((el) => {
            el.removeAttribute("open");
          });
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getActiveCount = (config: GlobalFilterConfig) => {
    if (config.type === "checkbox")
      return searchParams.getAll(config.id).length;
    if (config.type === "radio" || config.type === "date")
      return searchParams.get(config.id) ? 1 : 0;
    if (config.type === "date-range" || config.type === "number-range") {
      let count = 0;
      if (searchParams.get(`${config.id}Min`)) count++;
      if (searchParams.get(`${config.id}Max`)) count++;
      return count;
    }
    return 0;
  };

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🛡️ GUARD: Prevent any submission if already loading
    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const newParams = new URLSearchParams();

    filters.forEach((config) => {
      if (
        config.type === "text" ||
        config.type === "radio" ||
        config.type === "date"
      ) {
        const val = formData.get(config.id) as string;
        if (val && val.trim()) newParams.set(config.id, val.trim());
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

    document
      .querySelectorAll("details.universal-filter-dropdown")
      .forEach((el) => el.removeAttribute("open"));

    // Update URL silently
    router.push(`${pathname}?${newParams.toString()}`);

    // Explicit Event-Driven Execution
    onSearch(newParams);
  };

  const handleClearAll = () => {
    // 🛡️ GUARD
    if (isLoading) return;

    if (formRef.current) formRef.current.reset();
    setDropdownSearch({});
    router.push(pathname);
    // Grid remains as-is until they apply a new search
  };

  return (
    <div className="relative z-40 mx-auto mb-8 mt-6 w-full max-w-7xl px-4">
      <div className="rounded-2xl border border-blue-200/60 bg-white p-5 shadow-sm dark:border-blue-800/40 dark:bg-gray-950/90 lg:p-6">
        <form
          ref={formRef}
          onSubmit={handleApply}
          className="flex flex-col gap-6"
        >
          {/* TEXT INPUTS GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {textFilters.map((config) => {
              const Icon = config.icon;
              return (
                <div key={config.id} className="relative">
                  {Icon && (
                    <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    type="text"
                    name={config.id}
                    defaultValue={searchParams.get(config.id) || ""}
                    placeholder={config.placeholder}
                    className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 shadow-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:focus:bg-gray-800"
                  />
                </div>
              );
            })}
          </div>

          {/* ADVANCED DROPDOWNS */}
          <div className="flex flex-col justify-between gap-4 border-t border-blue-100 pt-4 dark:border-blue-900/30 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-3">
              {/* <span className="mr-2 flex items-center gap-2 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-sm font-semibold text-transparent">
                <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filters
              </span> */}

              {dropdownFilters.map((config) => {
                const Icon = config.icon;
                const activeCount = getActiveCount(config);
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
                    className="universal-filter-dropdown group relative"
                  >
                    <summary
                      className={`flex cursor-pointer select-none list-none items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition ${
                        isActive
                          ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
                        />
                      )}
                      {config.label}
                      {isActive &&
                        activeCount > 0 &&
                        config.type !== "date" && (
                          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                            {activeCount}
                          </span>
                        )}
                    </summary>

                    <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
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
                            className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                          />
                        </div>
                      )}

                      {config.type === "date" && (
                        <input
                          type="date"
                          name={config.id}
                          min="2018-05-07"
                          max={todayDateStr}
                          defaultValue={searchParams.get(config.id) || ""}
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                        />
                      )}

                      {config.type === "date-range" && (
                        <div className="space-y-2">
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              From
                            </label>
                            <input
                              type="date"
                              name={`${config.id}Min`}
                              min="2018-05-07"
                              max={todayDateStr}
                              defaultValue={
                                searchParams.get(`${config.id}Min`) || ""
                              }
                              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              To
                            </label>
                            <input
                              type="date"
                              name={`${config.id}Max`}
                              min="2018-05-07"
                              max={todayDateStr}
                              defaultValue={
                                searchParams.get(`${config.id}Max`) || ""
                              }
                              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                            />
                          </div>
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
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
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
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800"
                          />
                        </div>
                      )}

                      {(config.type === "radio" ||
                        config.type === "checkbox") &&
                        visibleOptions && (
                          <div className="custom-scrollbar max-h-60 space-y-1 overflow-y-auto">
                            {visibleOptions.map((opt) => (
                              <label
                                key={opt.value}
                                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <input
                                  type={config.type}
                                  name={config.id}
                                  value={opt.value}
                                  defaultChecked={
                                    config.type === "radio"
                                      ? searchParams.get(config.id) ===
                                        opt.value
                                      : searchParams
                                          .getAll(config.id)
                                          .includes(opt.value)
                                  }
                                  className={`h-4 w-4 text-blue-600 ${config.type === "radio" ? "rounded-full" : "rounded"}`}
                                />
                                {opt.icon && typeof opt.icon === "string" ? (
                                  <Image
                                    src={opt.icon}
                                    alt=""
                                    width={16}
                                    height={12}
                                    className="h-5 w-5 rounded-sm"
                                  />
                                ) : opt.icon ? (
                                  <opt.icon className="h-4 w-4 text-gray-500" />
                                ) : null}
                                <span className="truncate text-gray-700 dark:text-gray-300">
                                  {opt.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                    </div>
                  </details>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-end gap-3 lg:mt-0">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isLoading}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-500 transition hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" /> Clear
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#01bbfc] to-[#8b5cf6] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
