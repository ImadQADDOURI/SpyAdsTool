// @/components/top-stores-config.tsx
"use client";

import { useState } from "react";
import {
  createTopStore,
  deleteTopStore,
  getTopStores,
  updateTopStore,
} from "@/actions/top-stores";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useFormState } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export function TopStoresConfig({
  initialStores,
}: {
  initialStores: Awaited<ReturnType<typeof getTopStores>>;
}) {
  const [stores, setStores] = useState(initialStores);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<string | null>(null);
  const { toast } = useToast();

  // 🔄 Refresh stores data
  const refreshStores = async () => {
    const updatedStores = await getTopStores();
    setStores(updatedStores);
  };

  // 🗑️ Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteTopStore(id);
      await refreshStores();
      toast({
        title: "Success",
        description: "Store deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete store",
        variant: "destructive",
      });
    }
  };

  // ✨ Handle form submission (create/update)
  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingStore) {
        await updateTopStore(editingStore, formData);
        toast({
          title: "Success",
          description: "Store updated successfully",
          variant: "default",
        });
      } else {
        await createTopStore(formData);
        toast({
          title: "Success",
          description: "Store created successfully",
          variant: "default",
        });
      }
      await refreshStores();
      setIsDialogOpen(false);
      setEditingStore(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  // ✏️ Edit store handler
  const handleEdit = (store: (typeof stores)[0]) => {
    setEditingStore(store.id);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-2xl font-bold text-transparent">
          Top Stores
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              onClick={() => {
                setEditingStore(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStore ? "Edit Store" : "Add New Store"}
              </DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <Input
                name="image"
                placeholder="Image URL"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.image
                    : ""
                }
                required
              />
              <Input
                name="name"
                placeholder="Store Name"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.name
                    : ""
                }
                required
              />
              <Input
                name="niche"
                placeholder="Niche"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.niche
                    : ""
                }
                required
              />
              <Input
                name="link"
                placeholder="Store Link"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.link
                    : ""
                }
                required
              />
              <Input
                name="revenue"
                type="number"
                placeholder="Revenue"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.revenue
                    : ""
                }
                required
              />
              <Input
                name="sales"
                type="number"
                placeholder="Sales"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.sales
                    : ""
                }
                required
              />
              <Input
                name="CTA"
                placeholder="Call to Action"
                defaultValue={
                  editingStore
                    ? stores.find((s) => s.id === editingStore)?.CTA
                    : ""
                }
                required
              />
              <Button type="submit" className="w-full">
                {editingStore ? "Update Store" : "Add Store"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <img
                    src={store.image}
                    alt={store.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.niche}</TableCell>
                <TableCell>${store.revenue.toLocaleString()}</TableCell>
                <TableCell>{store.sales.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(store)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(store.id)}
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
    </div>
  );
}
