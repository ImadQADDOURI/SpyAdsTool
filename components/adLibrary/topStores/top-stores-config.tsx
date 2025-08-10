"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import {
  createTopStore,
  deleteTopStore,
  getTopStores,
  updateTopStore,
} from "@/actions/top-stores";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 🏪 Simple Store Type
type Store = {
  id?: string;
  image: string;
  name: string;
  niche: string;
  link: string;
  revenue: number;
  sales: number;
  CTA: string;
};

export function TopStoresConfig({
  initialStores,
}: {
  initialStores: Awaited<ReturnType<typeof getTopStores>>;
}) {
  const [stores, setStores] = useState(initialStores);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  // 📝 Form state
  const [formData, setFormData] = useState<Store>({
    image: "",
    name: "",
    niche: "",
    link: "",
    revenue: 0,
    sales: 0,
    CTA: "",
  });

  // 🔄 Refresh stores
  const refreshStores = async () => {
    try {
      const updatedStores = await getTopStores();
      setStores(updatedStores);
    } catch (error) {
      toast.error("Failed to refresh stores");
    }
  };

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      image: "",
      name: "",
      niche: "",
      link: "",
      revenue: 0,
      sales: 0,
      CTA: "",
    });
    setEditingStore(null);
  };

  // ✏️ Handle edit
  const handleEdit = (store: any) => {
    setEditingStore(store);
    setFormData(store);
    setIsDialogOpen(true);
  };

  // 💾 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.name.trim() ||
      !formData.image.trim() ||
      !formData.link.trim()
    ) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStore?.id) {
        // Create FormData for server action
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataObj.append(key, value.toString());
        });

        await updateTopStore(editingStore.id, formDataObj);
        toast.success("Store updated successfully");
      } else {
        // Create FormData for server action
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataObj.append(key, value.toString());
        });

        await createTopStore(formDataObj);
        toast.success("Store created successfully");
      }

      await refreshStores();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        editingStore ? "Failed to update store" : "Failed to create store",
      );
      console.error("❌ Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await deleteTopStore(id);
        await refreshStores();
        toast.success("Store deleted successfully");
      } catch (error) {
        toast.error("Failed to delete store");
        console.error("❌ Error deleting store:", error);
      }
    }
  };

  // 📝 Handle input change
  const handleInputChange = (field: keyof Store, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* ✨ Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Top Stores Management
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Add, edit, and manage featured stores
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStore ? "Edit Store" : "Add New Store"}
              </DialogTitle>
              <DialogDescription>
                {editingStore
                  ? "Update store details"
                  : "Fill in the details to add a new store"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* 🖼️ Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL *</Label>
                  <Input
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    required
                  />
                </div>

                {/* 🏪 Store Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    placeholder="Store name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* 🎯 Niche */}
                <div className="space-y-2">
                  <Label htmlFor="niche">Niche *</Label>
                  <Input
                    id="niche"
                    placeholder="Store category"
                    value={formData.niche}
                    onChange={(e) => handleInputChange("niche", e.target.value)}
                    required
                  />
                </div>

                {/* 🔗 Link */}
                <div className="space-y-2">
                  <Label htmlFor="link">Store Link *</Label>
                  <Input
                    id="link"
                    placeholder="https://example.com"
                    value={formData.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    required
                  />
                </div>

                {/* 💰 Revenue */}
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue *</Label>
                  <Input
                    id="revenue"
                    type="number"
                    min="0"
                    placeholder="50000"
                    value={formData.revenue}
                    onChange={(e) =>
                      handleInputChange(
                        "revenue",
                        Number.parseInt(e.target.value) || 0,
                      )
                    }
                    required
                  />
                </div>

                {/* 📈 Sales */}
                <div className="space-y-2">
                  <Label htmlFor="sales">Sales *</Label>
                  <Input
                    id="sales"
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={formData.sales}
                    onChange={(e) =>
                      handleInputChange(
                        "sales",
                        Number.parseInt(e.target.value) || 0,
                      )
                    }
                    required
                  />
                </div>
              </div>

              {/* 📢 Call to Action */}
              <div className="space-y-2">
                <Label htmlFor="CTA">Call to Action *</Label>
                <Input
                  id="CTA"
                  placeholder="Visit Store"
                  value={formData.CTA}
                  onChange={(e) => handleInputChange("CTA", e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingStore ? "Update Store" : "Add Store"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* 📋 Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stores</CardTitle>
          <CardDescription>Manage your store collection</CardDescription>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">No stores found</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first store
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Niche</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>CTA</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded">
                          <Image
                            src={store.image || "/placeholder.svg"}
                            alt={store.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate">
                          {store.name}
                        </div>
                      </TableCell>
                      <TableCell>{store.niche}</TableCell>
                      <TableCell className="font-medium">
                        ${store.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>{store.sales.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="max-w-[100px] truncate">
                          {store.CTA}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(store)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(store.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            {stores.length} store{stores.length !== 1 ? "s" : ""} total
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
