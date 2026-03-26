// @/app/ad-manager/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  deleteAdByArchiveId,
  getAdDatabaseStats,
  inspectAdByArchiveId,
} from "@/actions/adController";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";

export default function AdManagerPage() {
  const [apiKey, setApiKey] = useState("");
  const [stats, setStats] = useState({ total: 0, loading: true });

  // Import State
  const [importJson, setImportJson] = useState("");
  const [importCountry, setImportCountry] = useState("");
  const [importStatus, setImportStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [importMsg, setImportMsg] = useState("");

  // Delete State
  const [deleteId, setDeleteId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Inspect State
  const [inspectId, setInspectId] = useState("");
  const [inspectData, setInspectData] = useState<any>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  const fetchStats = async () => {
    setStats({ ...stats, loading: true });
    const res = await getAdDatabaseStats();
    if (res.success) setStats({ total: res.totalAds || 0, loading: false });
    else setStats({ total: 0, loading: false });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // --- Handlers ---
  const handleImport = async () => {
    setImportStatus("loading");
    if (!apiKey) {
      setImportStatus("error");
      setImportMsg("API Key is required.");
      return;
    }

    try {
      const parsedAdData = JSON.parse(importJson);
      const ad_archive_id = parsedAdData.ad_archive_id;

      if (!ad_archive_id) throw new Error("Missing ad_archive_id in JSON.");

      const payload = {
        ad_archive_id,
        adData: parsedAdData,
        country: importCountry.trim() || "ALL",
      };

      const res = await fetch("/api/extension/ads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setImportStatus("success");
        setImportMsg("Ad imported successfully!");
        setImportJson("");
        fetchStats(); // Update count
      } else {
        throw new Error(data.message || "Import failed.");
      }
    } catch (error: any) {
      setImportStatus("error");
      setImportMsg(error.message || "Invalid JSON format.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId.trim()) return;
    if (!confirm("Are you sure you want to delete this ad?")) return;

    setIsDeleting(true);
    const res = await deleteAdByArchiveId(deleteId.trim());
    setIsDeleting(false);

    if (res.success) {
      alert(res.message);
      setDeleteId("");
      fetchStats();
    } else {
      alert(res.error);
    }
  };

  const handleInspect = async () => {
    if (!inspectId.trim()) return;
    setIsInspecting(true);
    setInspectData(null);

    const res = await inspectAdByArchiveId(inspectId.trim());
    setIsInspecting(false);

    if (res.success) {
      setInspectData(res.ad);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header & Stats */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <Database className="h-6 w-6 text-blue-600" /> Database Manager
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage global ads, debug ingestion, and monitor data.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 px-6 py-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Total Ads Indexed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.loading ? (
                  <RefreshCw className="mx-auto mt-1 h-5 w-5 animate-spin" />
                ) : (
                  stats.total.toLocaleString()
                )}
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="rounded-full p-2 transition hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>

        {/* Global API Key Input */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            CHROME_EXTENSION_API_KEY (Required for Imports)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter secure API key..."
            className="w-full max-w-md rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT COLUMN: Import & Delete */}
          <div className="space-y-8">
            {/* Import Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <UploadCloud className="h-5 w-5 text-green-500" /> Manual Ad
                Import
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country Override (Optional)
                  </label>
                  <input
                    type="text"
                    value={importCountry}
                    onChange={(e) =>
                      setImportCountry(e.target.value.toUpperCase())
                    }
                    placeholder="e.g., US, CA, BR"
                    maxLength={2}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 uppercase outline-none dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Raw JSON Payload
                  </label>
                  <textarea
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    rows={8}
                    placeholder='{"ad_archive_id": "...", "snapshot": {...}}'
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs outline-none dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>
                <button
                  onClick={handleImport}
                  disabled={importStatus === "loading" || !importJson}
                  className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {importStatus === "loading" ? "Processing..." : "Run Import"}
                </button>

                {importMsg && (
                  <div
                    className={`flex items-start gap-2 rounded-lg p-3 text-sm ${importStatus === "success" ? "border border-green-200 bg-green-50 text-green-800" : "border border-red-200 bg-red-50 text-red-800"}`}
                  >
                    {importStatus === "success" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span className="break-all">{importMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delete Card */}
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-800">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400">
                <Trash2 className="h-5 w-5" /> Danger Zone: Delete Ad
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={deleteId}
                  onChange={(e) => setDeleteId(e.target.value)}
                  placeholder="Paste ad_archive_id..."
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none dark:border-gray-600 dark:bg-gray-900"
                />
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !deleteId}
                  className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Inspect Ad */}
          <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Search className="h-5 w-5 text-indigo-500" /> Inspect Database
              Record
            </h2>
            <div className="mb-4 flex gap-3">
              <input
                type="text"
                value={inspectId}
                onChange={(e) => setInspectId(e.target.value)}
                placeholder="Paste ad_archive_id..."
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 outline-none dark:border-gray-600 dark:bg-gray-900"
              />
              <button
                onClick={handleInspect}
                disabled={isInspecting || !inspectId}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {isInspecting ? "Searching..." : "Fetch"}
              </button>
            </div>

            <div className="flex min-h-[400px] flex-1 flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
              {inspectData ? (
                <div className="custom-scrollbar h-full overflow-auto p-4">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-green-400">
                    {JSON.stringify(inspectData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-500">
                  <Search className="mb-2 h-10 w-10 opacity-20" />
                  <p className="text-sm">
                    Search an ID to view its raw data, array contents, and
                    timestamps as stored in PostgreSQL.
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
