// @/app/extension-tester/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  List,
  PlusCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

export default function ExtensionTesterPage() {
  // --- GET State (Fetch Saved Ads) ---
  const [savedAds, setSavedAds] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // --- POST State (Save Ad) ---
  const [saveId, setSaveId] = useState("");
  const [saveJson, setSaveJson] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [saveMsg, setSaveMsg] = useState("");

  // --- DELETE State (Remove Ad) ---
  const [deleteId, setDeleteId] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [deleteMsg, setDeleteMsg] = useState("");

  // --- Handlers ---

  // 1. GET: Fetch Saved Ads
  const handleFetchAds = async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/extension/ads");
      const data = await res.json();

      if (res.ok) {
        setSavedAds(data.savedAds || []);
      } else {
        throw new Error(data.message || "Failed to fetch ads");
      }
    } catch (error: any) {
      setFetchError(error.message || "An unknown error occurred");
    } finally {
      setIsFetching(false);
    }
  };

  // Initial Fetch on mount
  useEffect(() => {
    handleFetchAds();
  }, []);

  // 2. POST: Save Ad
  const handleSaveAd = async () => {
    setSaveStatus("loading");
    setSaveMsg("");

    if (!saveId.trim() || !saveJson.trim()) {
      setSaveStatus("error");
      setSaveMsg("Both Ad Archive ID and JSON data are required.");
      return;
    }

    try {
      // Parse the adData to ensure it's valid JSON
      const parsedAdData = JSON.parse(saveJson);

      const payload = {
        ad_archive_id: saveId.trim(),
        adData: parsedAdData,
      };

      const res = await fetch("/api/extension/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSaveStatus("success");
        setSaveMsg("Ad successfully saved!");
        setSaveId("");
        setSaveJson("");
        handleFetchAds(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to save ad.");
      }
    } catch (error: any) {
      setSaveStatus("error");
      setSaveMsg(error.message || "Invalid JSON format.");
    }
  };

  // 3. DELETE: Remove Ad
  const handleDeleteAd = async () => {
    if (!deleteId.trim()) return;

    setDeleteStatus("loading");
    setDeleteMsg("");

    try {
      const res = await fetch(
        `/api/extension/ads?ad_archive_id=${encodeURIComponent(deleteId.trim())}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setDeleteStatus("success");
        setDeleteMsg("Ad successfully removed!");
        setDeleteId("");
        handleFetchAds(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to delete ad.");
      }
    } catch (error: any) {
      setDeleteStatus("error");
      setDeleteMsg(error.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <Heart className="h-6 w-6 text-pink-500" fill="currentColor" />{" "}
              Extension Favorites Tester
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Test your GET, POST, and DELETE endpoints for /api/extension/ads.
              <br />
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                Note: You must be logged in to test this route successfully.
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT COLUMN: POST & DELETE */}
          <div className="space-y-8">
            {/* POST: Save Ad Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <PlusCircle className="h-5 w-5 text-blue-500" /> Save Ad (POST)
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ad Archive ID
                  </label>
                  <input
                    type="text"
                    value={saveId}
                    onChange={(e) => setSaveId(e.target.value)}
                    placeholder="e.g., 1234567890"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    AdData (Raw JSON)
                  </label>
                  <textarea
                    value={saveJson}
                    onChange={(e) => setSaveJson(e.target.value)}
                    rows={6}
                    placeholder='{"publisher_platforms": ["facebook"], "impressions": {...}}'
                    className="custom-scrollbar w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs outline-none dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>

                <button
                  onClick={handleSaveAd}
                  disabled={saveStatus === "loading"}
                  className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saveStatus === "loading" ? "Saving..." : "Save Ad"}
                </button>

                {saveMsg && (
                  <div
                    className={`flex items-start gap-2 rounded-lg p-3 text-sm ${saveStatus === "success" ? "border border-green-200 bg-green-50 text-green-800" : "border border-red-200 bg-red-50 text-red-800"}`}
                  >
                    {saveStatus === "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span className="break-all">{saveMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* DELETE: Remove Ad Card */}
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-800">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400">
                <Trash2 className="h-5 w-5" /> Unsave Ad (DELETE)
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    placeholder="Enter ad_archive_id..."
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none dark:border-gray-600 dark:bg-gray-900"
                  />
                  <button
                    onClick={handleDeleteAd}
                    disabled={deleteStatus === "loading" || !deleteId}
                    className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteStatus === "loading" ? "Removing..." : "Remove"}
                  </button>
                </div>

                {deleteMsg && (
                  <div
                    className={`mt-2 flex items-start gap-2 rounded-lg p-3 text-sm ${deleteStatus === "success" ? "border border-green-200 bg-green-50 text-green-800" : "border border-red-200 bg-red-50 text-red-800"}`}
                  >
                    {deleteStatus === "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span className="break-all">{deleteMsg}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: GET Saved Ads (Live View) */}
          <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <List className="h-5 w-5 text-indigo-500" /> Saved Ads Viewer
                (GET)
              </h2>
              <button
                onClick={handleFetchAds}
                disabled={isFetching}
                className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {fetchError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="break-all">{fetchError}</span>
              </div>
            )}

            <div className="flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
              {isFetching && savedAds.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-gray-500">
                  <RefreshCw className="mb-2 h-8 w-8 animate-spin opacity-50" />
                  <p className="text-sm">Fetching your saved ads...</p>
                </div>
              ) : savedAds.length > 0 ? (
                <div className="custom-scrollbar h-full overflow-auto p-4">
                  <div className="mb-3 text-xs font-semibold text-gray-400">
                    Total Ads Saved: {savedAds.length}
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-green-400">
                    {JSON.stringify(savedAds, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-500">
                  <Heart className="mb-2 h-10 w-10 opacity-20" />
                  <p className="text-sm">
                    No ads found in your "Extension Saves" board.
                    <br />
                    Use the panel on the left to POST an ad and save it!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
