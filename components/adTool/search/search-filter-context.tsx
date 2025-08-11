"use client";

import type React from "react";
import { createContext, useCallback, useContext, useRef } from "react";

import { filterConfig } from "./filter-config";
import type { SearchParams } from "./filter-config";

interface SearchFilterContextType {
  getValue: (key: string) => any;
  setValue: (key: string, value: any) => void;
  clearValue: (key: string) => void;
  clearAllValues: () => void;
  getSearchParams: () => SearchParams;
  getAppliedFiltersCount: () => number;
  subscribe: (key: string, callback: (value: any) => void) => () => void;
  subscribeToCount: (callback: (count: number) => void) => () => void;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(
  undefined,
);

export const useSearchFilters = () => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error(
      "useSearchFilters must be used within a SearchFilterProvider",
    );
  }
  return context;
};

interface SearchFilterProviderProps {
  children: React.ReactNode;
  defaultValues?: Record<string, any>;
}

export const SearchFilterProvider: React.FC<SearchFilterProviderProps> = ({
  children,
  defaultValues = {},
}) => {
  // Initialize filters with default values
  const filtersRef = useRef<Record<string, any>>({ ...defaultValues });

  // Callback storage for UI updates
  const valueCallbacksRef = useRef<Map<string, Set<(value: any) => void>>>(
    new Map(),
  );
  const countCallbacksRef = useRef<Set<(count: number) => void>>(new Set());

  // Update queue for batching
  const updateQueueRef = useRef<Set<string>>(new Set());
  const isUpdatingRef = useRef(false);

  /**
   * Batch updates using requestAnimationFrame for optimal performance
   */
  const batchUpdates = useCallback(() => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    requestAnimationFrame(() => {
      const keysToUpdate = Array.from(updateQueueRef.current);
      updateQueueRef.current.clear();

      // Update value callbacks
      keysToUpdate.forEach((key) => {
        const callbacks = valueCallbacksRef.current.get(key);
        if (callbacks) {
          const value = filtersRef.current[key] || null;
          callbacks.forEach((callback) => callback(value));
        }
      });

      // Update count callbacks
      const count = Object.entries(filtersRef.current).filter(
        ([key, value]) =>
          key !== "q" &&
          value !== null &&
          (Array.isArray(value) ? value.length > 0 : value !== ""),
      ).length;

      countCallbacksRef.current.forEach((callback) => callback(count));
      isUpdatingRef.current = false;
    });
  }, []);

  const getValue = useCallback((key: string) => {
    return filtersRef.current[key] || null;
  }, []);

  const setValue = useCallback(
    (key: string, value: any) => {
      const currentValue = filtersRef.current[key];
      if (currentValue === value) return;

      // Clean up empty values
      if (
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete filtersRef.current[key];
      } else {
        filtersRef.current[key] = value;
      }

      updateQueueRef.current.add(key);
      batchUpdates();
    },
    [batchUpdates],
  );

  const clearValue = useCallback(
    (key: string) => {
      if (key in filtersRef.current) {
        delete filtersRef.current[key];
        updateQueueRef.current.add(key);
        batchUpdates();
      }
    },
    [batchUpdates],
  );

  const clearAllValues = useCallback(() => {
    const keys = Object.keys(filtersRef.current);
    filtersRef.current = {};
    keys.forEach((key) => updateQueueRef.current.add(key));
    batchUpdates();
  }, [batchUpdates]);

  const getSearchParams = useCallback((): SearchParams => {
    const params: SearchParams = {};

    Object.entries(filtersRef.current).forEach(([key, value]) => {
      const filterDef = filterConfig.find((f) => f.key === key);
      if (!filterDef) return;

      switch (filterDef.paramKey) {
        case "q":
          params.q = value;
          break;
        case "category_as_keyword":
          params.category_as_keyword = value;
          break;
        case "search_type":
          params.search_type = value;
          break;
        case "active_status":
          params.active_status = value;
          break;
        case "ad_type":
          params.ad_type = value;
          break;
        case "content_languages":
          params.content_languages = Array.isArray(value) ? value : [value];
          break;
        case "countries":
          params.countries = Array.isArray(value) ? value : [value];
          break;
        case "media_type":
          params.media_type = value;
          break;
        case "publisher_platforms":
          params.publisher_platforms = Array.isArray(value) ? value : [value];
          break;
        case "sort_data":
          params.sort_data = value;
          break;
        case "start_date":
          params.start_date = value;
          break;
        case "end_date":
          params.end_date = value;
          break;
      }
    });

    return params;
  }, []);

  const getAppliedFiltersCount = useCallback(() => {
    return Object.entries(filtersRef.current).filter(
      ([key, value]) =>
        key !== "q" &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : value !== ""),
    ).length;
  }, []);

  const subscribe = useCallback(
    (key: string, callback: (value: any) => void) => {
      if (!valueCallbacksRef.current.has(key)) {
        valueCallbacksRef.current.set(key, new Set());
      }
      valueCallbacksRef.current.get(key)!.add(callback);

      // Call immediately with current value
      callback(filtersRef.current[key] || null);

      // Return cleanup function
      return () => valueCallbacksRef.current.get(key)?.delete(callback);
    },
    [],
  );

  const subscribeToCount = useCallback(
    (callback: (count: number) => void) => {
      countCallbacksRef.current.add(callback);
      callback(getAppliedFiltersCount());
      return () => countCallbacksRef.current.delete(callback);
    },
    [getAppliedFiltersCount],
  );

  const contextValue: SearchFilterContextType = {
    getValue,
    setValue,
    clearValue,
    clearAllValues,
    getSearchParams,
    getAppliedFiltersCount,
    subscribe,
    subscribeToCount,
  };

  return (
    <SearchFilterContext.Provider value={contextValue}>
      {children}
    </SearchFilterContext.Provider>
  );
};
