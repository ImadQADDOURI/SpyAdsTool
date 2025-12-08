"use client";

import { useEffect, useRef, useState } from "react";
import { importMetaRequests, listMetaRequests } from "@/actions/metaRequests";
import { Import, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateEditModal } from "@/components/adTool/meta/create-edit-modal";
import { MetaRequestsList } from "@/components/adTool/meta/requests-list";
import { TestPanel } from "@/components/adTool/meta/test-panel";

export function MetaDashboardClient() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const result = await listMetaRequests();
      if (result.success) {
        setRequests(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setEditingRequest(null);
    loadRequests();
  };

  const handleEditRequest = (request: any) => {
    setEditingRequest(request);
    setIsCreateModalOpen(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      const result = await importMetaRequests(jsonData);

      if (result.success) {
        // alert(`${result.data?.count || 0} requests imported successfully!`);
        loadRequests();
      } else {
        console.error("Import failed:", result.error);
        alert(`Import failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error("Failed to process file:", error);
      alert(`Failed to process file: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Meta GraphQL Admin
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage and test Meta GraphQL requests
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadRequests}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <Import className="h-4 w-4" />
              Import Requests
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <Button
              onClick={() => {
                setEditingRequest(null);
                setIsCreateModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Requests List */}
          <div className="lg:col-span-1">
            <MetaRequestsList
              requests={requests}
              loading={loading}
              selectedRequest={selectedRequest}
              onSelectRequest={setSelectedRequest}
              onEditRequest={handleEditRequest}
              onRequestsChange={loadRequests}
            />
          </div>

          {/* Right: Test Panel */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <TestPanel request={selectedRequest} />
            ) : (
              <Card className="flex h-full items-center justify-center">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Select a request to test it
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <CreateEditModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingRequest(null);
        }}
        editingRequest={editingRequest}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
