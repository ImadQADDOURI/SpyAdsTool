"use client";

import { useEffect, useState } from "react";
import { listMetaRequests } from "@/actions/metaRequests";
import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreateEditModal } from "@/components/adTool/meta/create-edit-modal";
import { MetaRequestsList } from "@/components/adTool/meta/requests-list";
import { TestPanel } from "@/components/adTool/meta/test-panel";

export default function MetaDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);

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
