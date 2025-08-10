"use client";

import type React from "react";
import { useState } from "react";
import { createMetaGraphQLConfig } from "@/actions/meta-graphql-config-actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// 🖋️ Simplified Configuration Form Component
export default function MetaGraphQLConfigForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Input validation
  const validateConfig = (config: unknown) => {
    if (!config || typeof config !== "object") {
      throw new Error("Input must be a JSON object");
    }

    const { url, headers, method, body } = config as Record<string, unknown>;

    if (typeof url !== "string" || !url.startsWith("https://")) {
      throw new Error("Invalid URL - Must be HTTPS URL");
    }
    if (typeof headers !== "object" || !headers) {
      throw new Error("Headers must be an object");
    }
    if (
      typeof method !== "string" ||
      !["POST", "GET"].includes(method.toUpperCase())
    ) {
      throw new Error("Invalid HTTP method - Only POST/GET allowed");
    }
    if (typeof body !== "string") {
      throw new Error("Body must be a string");
    }
  };

  // 🚀 Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonInput.trim()) {
      toast.error("Please enter a configuration");
      return;
    }

    setIsSubmitting(true);
    try {
      const config = JSON.parse(jsonInput);
      validateConfig(config);

      const result = await createMetaGraphQLConfig(config);

      if (result.success) {
        setJsonInput("");
        toast.success("🎉 Configuration saved successfully!");
      } else {
        throw new Error(result.error || "Database save failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔄 Reset form
  const handleReset = () => {
    setJsonInput("");
    toast.success("Form reset");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
          Add New Configuration
        </CardTitle>
        <CardDescription>
          Enter your Meta GraphQL API configuration in JSON format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
            placeholder={`{
  "url": "https://graph.facebook.com/v18.0/act_123456789/adcreatives",
  "headers": {
    "content-type": "application/x-www-form-urlencoded"
  },
  "method": "POST",
  "body": "access_token=YOUR_TOKEN&fields=name,body"
}`}
          />

          <div className="flex justify-between">
            <Button type="button" onClick={handleReset} variant="outline">
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
