// @components/adLibrary/meta-graphql-configs/MetaGraphQLConfigForm.tsx
"use client";

import { useState } from "react";
import { createMetaGraphQLConfig } from "@/actions/meta-graphql-config-actions";

// 🖋️ CONFIGURATION FORM COMPONENT =============================================
export default function MetaGraphQLConfigForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  // ✅ INPUT VALIDATION =======================================================
  const validateConfig = (config: unknown) => {
    // 🚨 Basic type check
    if (!config || typeof config !== "object") {
      throw new Error("📦 Input must be a JSON object");
    }

    const { url, headers, method, body } = config as Record<string, unknown>;

    // 🔍 Field-by-field validation
    if (typeof url !== "string" || !url.startsWith("https://")) {
      throw new Error("🔗 Invalid URL - Must be HTTPS URL");
    }
    if (typeof headers !== "object" || !headers) {
      throw new Error("🔑 Headers must be an object");
    }
    if (
      typeof method !== "string" ||
      !["POST", "GET"].includes(method.toUpperCase())
    ) {
      throw new Error("⚡ Invalid HTTP method - Only POST/GET allowed");
    }
    if (typeof body !== "string") {
      throw new Error("📦 Body must be a string");
    }
  };

  // 🚀 FORM SUBMISSION HANDLER ================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving configuration..." });

    try {
      // 🧩 Parse and validate input
      const config = JSON.parse(jsonInput);
      validateConfig(config);

      // 💾 Save to database
      const result = await createMetaGraphQLConfig(config);

      // ✅ Success handling
      if (result.success) {
        setJsonInput("");
        setStatus({
          type: "success",
          message: "🎉 Configuration saved successfully!",
        });
      } else {
        throw new Error(result.error || "💾 Database save failed");
      }
    } catch (error) {
      // ❌ Error handling
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "❌ Unknown error occurred",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-6 shadow-md"
    >
      {/* 📝 JSON INPUT TEXTAREA */}
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="h-64 w-full rounded-lg border-2 border-gray-200 p-4 font-mono text-sm focus:border-blue-500 focus:ring-2"
        placeholder={`{\n  "url": "https://...",\n  "headers": {\n    "content-type": "application/x-www-form-urlencoded"\n  },\n  "method": "POST",\n  "body": "av=123&param2=value"\n}`}
        aria-label="XHR Configuration JSON"
      />

      {/* 🎯 STATUS INDICATOR */}
      {status.type !== "idle" && (
        <div
          className={`rounded-lg p-3 ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* 🚀 SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={status.type === "loading"}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      >
        {status.type === "loading" ? (
          <>
            <span className="animate-spin">⏳</span>
            Saving...
          </>
        ) : (
          "💾 Save Configuration"
        )}
      </button>
    </form>
  );
}
