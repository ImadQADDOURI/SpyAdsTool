"use client";

import type React from "react";
import { useState } from "react";
import { deleteMetaRequest, toggleMetaRequest } from "@/actions/metaRequests";
import { Edit2, Loader2, Power, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RequestsListProps {
  requests: any[];
  loading: boolean;
  selectedRequest: any;
  onSelectRequest: (request: any) => void;
  onEditRequest: (request: any) => void;
  onRequestsChange: () => void;
}

export function MetaRequestsList({
  requests,
  loading,
  selectedRequest,
  onSelectRequest,
  onEditRequest,
  onRequestsChange,
}: RequestsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState<string>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const uniqueNames = Array.from(new Set(requests.map((r) => r.name)));

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.friendly_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterName === "all" || req.name === filterName;
    return matchesSearch && matchesFilter;
  });

  const handleToggle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingId(id);
    try {
      await toggleMetaRequest(id);
      onRequestsChange();
    } catch (error) {
      console.error("Failed to toggle request:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMetaRequest(deletingId);
      onRequestsChange();
      setShowDeleteDialog(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Requests</CardTitle>
        <CardDescription>{requests.length} total requests</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Search */}
        <Input
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />

        {/* Filter by Name */}
        <Select value={filterName} onValueChange={setFilterName}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Filter by name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Names</SelectItem>
            {uniqueNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Requests List */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No requests found
            </p>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 transition-all",
                  selectedRequest?.id === req.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {req.friendly_name || req.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {req.name}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge
                        variant={req.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {req.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {req.doc_id && (
                        <Badge variant="outline" className="text-xs">
                          {req.doc_id}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleToggle(req.id, e)}
                      disabled={togglingId === req.id}
                      className="h-8 w-8 p-0"
                    >
                      {togglingId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Power
                          className={cn(
                            "h-4 w-4",
                            req.is_active
                              ? "text-green-500"
                              : "text-muted-foreground",
                          )}
                        />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRequest(req);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(req.id);
                        setShowDeleteDialog(true);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this request? This action cannot be
            undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
