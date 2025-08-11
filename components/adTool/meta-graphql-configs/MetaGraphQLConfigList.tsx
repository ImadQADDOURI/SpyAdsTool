"use client";

import { useState } from "react";
import {
  deleteMetaGraphQLConfig,
  getMetaGraphQLConfigs,
  testMetaGraphQLConfig,
  toggleMetaGraphQLConfig,
  updateMetaGraphQLConfig,
} from "@/actions/meta-graphql-config-actions";
import type { MetaGraphQLConfig } from "@prisma/client";
import { Edit, Eye, RotateCcw, TestTube, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import RefreshConfigsButton from "./RefreshConfigsButton";

type MetaGraphQLConfigListProps = {
  initialConfigs: MetaGraphQLConfig[];
};

// 🖥️ Main Configuration List Component
export default function MetaGraphQLConfigList({
  initialConfigs,
}: MetaGraphQLConfigListProps) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingJson, setEditingJson] = useState("");
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 📊 Calculate active configs count
  const activeCount = configs.filter((config) => config.is_active).length;
  const totalCount = configs.length;

  // 🔄 Refresh configurations
  const refreshConfigs = async () => {
    setIsRefreshing(true);
    try {
      const { success, data } = await getMetaGraphQLConfigs();
      if (success && data) {
        setConfigs(data);
        toast.success("Configurations refreshed");
      }
    } catch (error) {
      toast.error("Failed to refresh configurations");
    } finally {
      setIsRefreshing(false);
    }
  };

  // 🔄 Reset to initial state
  const handleReset = () => {
    setConfigs(initialConfigs);
    setEditingId(null);
    setEditingJson("");
    setTestResults({});
    toast.success("Reset to initial state");
  };

  // 🎯 Toggle configuration active status
  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const { success } = await toggleMetaGraphQLConfig(id, !currentStatus);
      if (success) {
        await refreshConfigs();
        toast.success(
          `Configuration ${!currentStatus ? "activated" : "deactivated"}`,
        );
      }
    } catch (error) {
      toast.error("Failed to toggle configuration");
    }
  };

  // 🗑️ Delete configuration
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this configuration?"))
      return;

    try {
      const { success } = await deleteMetaGraphQLConfig(id);
      if (success) {
        await refreshConfigs();
        toast.success("Configuration deleted");
      }
    } catch (error) {
      toast.error("Failed to delete configuration");
    }
  };

  // ✏️ Start editing
  const handleEdit = (config: MetaGraphQLConfig) => {
    setEditingId(config.id);
    setEditingJson(JSON.stringify(config.graphql_xhr, null, 2));
  };

  // 💾 Save edited configuration
  const handleSave = async (id: string) => {
    try {
      const parsedConfig = JSON.parse(editingJson);
      if (typeof parsedConfig.body !== "string") {
        throw new Error("Body must be a string");
      }

      const { success } = await updateMetaGraphQLConfig(id, parsedConfig);
      if (success) {
        await refreshConfigs();
        setEditingId(null);
        toast.success("Configuration updated");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid JSON format";
      setTestResults({
        ...testResults,
        [id]: {
          success: false,
          data: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      });
      toast.error(errorMessage);
    }
  };

  // 🧪 Test configuration
  const handleTest = async (id: string) => {
    try {
      const { success, data, error } = await testMetaGraphQLConfig(id);
      setTestResults({
        ...testResults,
        [id]: {
          success,
          data: success ? data : error,
          timestamp: new Date().toLocaleTimeString(),
        },
      });
      toast.success(success ? "Test successful" : "Test failed");
    } catch (error) {
      toast.error("Failed to test configuration");
    }
  };

  return (
    <div className="space-y-6">
      {/* 📊 Header with Stats and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Meta GraphQL Configurations
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your GraphQL API configurations and test their
                connectivity
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {/* 📊 Active Count Badge */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={activeCount > 0 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {activeCount} / {totalCount} Active
                </Badge>
              </div>
              <RefreshConfigsButton />
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={refreshConfigs}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <Eye
                  className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 📋 Configuration List */}
      <div className="space-y-4">
        {configs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No configurations found
              </p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Add your first configuration using the form above
              </p>
            </CardContent>
          </Card>
        ) : (
          configs.map((config) => (
            <Card key={config.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={config.is_active ? "default" : "secondary"}>
                      {config.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(config.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleTest(config.id)}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <TestTube className="mr-1 h-3 w-3" />
                      Test
                    </Button>
                    <Button
                      onClick={() => handleToggle(config.id, config.is_active)}
                      variant="outline"
                      size="sm"
                      className={
                        config.is_active
                          ? "text-orange-600 hover:text-orange-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      {config.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(config)}
                      variant="outline"
                      size="sm"
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(config.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {editingId === config.id ? (
                  // ✏️ Editing Mode
                  <div className="space-y-4">
                    <Textarea
                      value={editingJson}
                      onChange={(e) => setEditingJson(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                      placeholder="Edit configuration JSON..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleSave(config.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 📄 View Mode
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Configuration Details */}
                    <div>
                      <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                        Configuration
                      </h4>
                      <pre className="max-h-48 overflow-auto rounded-lg border bg-gray-50 p-4 text-sm dark:bg-gray-900">
                        {JSON.stringify(config.graphql_xhr, null, 2)}
                      </pre>
                    </div>

                    {/* Test Results */}
                    {testResults[config.id] && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">
                            Test Results
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {testResults[config.id].timestamp}
                          </span>
                        </div>
                        <pre
                          className={`max-h-48 overflow-auto rounded-lg border p-4 text-sm ${
                            testResults[config.id].success
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                              : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                          }`}
                        >
                          {typeof testResults[config.id].data === "string"
                            ? testResults[config.id].data
                            : JSON.stringify(
                                testResults[config.id].data,
                                null,
                                2,
                              )}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
