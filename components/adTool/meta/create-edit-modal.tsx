// components\adTool\meta\create-edit-modal.tsx
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { createMetaRequest, updateMetaRequest } from "@/actions/metaRequests";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRequest?: any;
  onSuccess: () => void;
}

export function CreateEditModal({
  isOpen,
  onClose,
  editingRequest,
  onSuccess,
}: CreateEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    friendly_name: "",
    doc_id: "",
    base_request: "{}",
    fields_to_extract: "{}",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingRequest) {
      setFormData({
        name: editingRequest.name,
        friendly_name: editingRequest.friendly_name || "",
        doc_id: editingRequest.doc_id || "",
        base_request: JSON.stringify(editingRequest.base_request, null, 2),
        fields_to_extract: JSON.stringify(
          editingRequest.fields_to_extract,
          null,
          2,
        ),
      });
    } else {
      setFormData({
        name: "",
        friendly_name: "",
        doc_id: "",
        base_request: "{}",
        fields_to_extract: "{}",
      });
    }
    setErrors({});
  }, [editingRequest, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate base_request JSON and required fields
    try {
      const baseRequest = JSON.parse(formData.base_request);

      // Check for required fields
      const requiredFields = ["url", "method", "requestHeaders", "requestBody"];
      const missingFields = requiredFields.filter(
        (field) => !baseRequest[field],
      );

      if (missingFields.length > 0) {
        newErrors.base_request = `Missing required fields: ${missingFields.join(", ")}`;
      }
    } catch {
      newErrors.base_request = "Invalid JSON";
    }

    // Validate fields_to_extract JSON
    try {
      JSON.parse(formData.fields_to_extract);
    } catch {
      newErrors.fields_to_extract = "Invalid JSON";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = {
        name: formData.name,
        friendly_name: formData.friendly_name || undefined,
        doc_id: formData.doc_id || undefined,
        base_request: JSON.parse(formData.base_request),
        fields_to_extract: JSON.parse(formData.fields_to_extract),
      };

      if (editingRequest) {
        await updateMetaRequest(editingRequest.id, data);
      } else {
        await createMetaRequest(data);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save request:", error);
      setErrors({ submit: "Failed to save request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRequest ? "Edit Request" : "Create New Request"}
          </DialogTitle>
          <DialogDescription>
            {editingRequest
              ? "Update the request configuration"
              : "Add a new Meta GraphQL request configuration"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., ad_search"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="friendly_name">Friendly Name</Label>
              <Input
                id="friendly_name"
                value={formData.friendly_name}
                onChange={(e) =>
                  setFormData({ ...formData, friendly_name: e.target.value })
                }
                placeholder="e.g., Ad Search Query"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc_id">Doc ID</Label>
            <Input
              id="doc_id"
              value={formData.doc_id}
              onChange={(e) =>
                setFormData({ ...formData, doc_id: e.target.value })
              }
              placeholder="Meta GraphQL doc_id"
            />
          </div>

          {/* JSON Tabs */}
          <Tabs defaultValue="base_request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="base_request">Base Request</TabsTrigger>
              <TabsTrigger value="fields_to_extract">
                Fields to Extract
              </TabsTrigger>
            </TabsList>

            <TabsContent value="base_request" className="space-y-2">
              <Label htmlFor="base_request">Base Request JSON *</Label>
              <Textarea
                id="base_request"
                value={formData.base_request}
                onChange={(e) =>
                  setFormData({ ...formData, base_request: e.target.value })
                }
                placeholder='{"url": "...", "method": "POST", "requestHeaders": {...}, "requestBody": "..."}'
                className={`h-64 font-mono text-xs ${errors.base_request ? "border-destructive" : ""}`}
              />
              {errors.base_request && (
                <p className="text-xs text-destructive">
                  {errors.base_request}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Required fields: url, method, requestHeaders, requestBody
              </p>
            </TabsContent>

            <TabsContent value="fields_to_extract" className="space-y-2">
              <Label htmlFor="fields_to_extract">
                Fields to Extract JSON *
              </Label>
              <Textarea
                id="fields_to_extract"
                value={formData.fields_to_extract}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fields_to_extract: e.target.value,
                  })
                }
                placeholder='{"ad_id": "$.data.viewer.ads[*].id", "ad_name": "$.data.viewer.ads[*].name"}'
                className={`h-64 font-mono text-xs ${errors.fields_to_extract ? "border-destructive" : ""}`}
              />
              {errors.fields_to_extract && (
                <p className="text-xs text-destructive">
                  {errors.fields_to_extract}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Map of field names to JSONPath expressions
              </p>
            </TabsContent>
          </Tabs>

          {errors.submit && (
            <p className="text-sm text-destructive">{errors.submit}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingRequest ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
