"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  importProducts,
  updateProduct,
} from "@/actions/products";
import { countryOptions } from "@/configuration/globalFilters";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  DollarSign,
  Download,
  ImageIcon,
  LinkIcon,
  Loader2,
  Pencil,
  Plus,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 📦 Simple Product Type
type Product = {
  id?: string;
  image: string;
  title: string;
  niche?: string;
  link: string;
  uploadDate?: Date | null;
  stars?: number | null;
  buyPrice?: number | null;
  sellPrice?: number | null;
  totalSales?: number | null;
  countries: string[];
};

// 🧩 Main Component
export default function ProductsConfig() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 📝 Form state
  const [formData, setFormData] = useState<Product>({
    image: "",
    title: "",
    niche: "",
    link: "",
    uploadDate: null,
    stars: null,
    buyPrice: null,
    sellPrice: null,
    totalSales: null,
    countries: [],
  });

  // 📥 Load products
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
        console.error("❌ Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      image: "",
      title: "",
      niche: "",
      link: "",
      uploadDate: null,
      stars: null,
      buyPrice: null,
      sellPrice: null,
      totalSales: null,
      countries: [],
    });
    setSelectedCountries([]);
    setEditingProduct(null);
  };

  // ✏️ Handle edit
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      niche: product.niche || "",
    });
    setSelectedCountries(product.countries || []);
    setIsDialogOpen(true);
  };

  // 💾 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.title.trim() ||
      !formData.image.trim() ||
      !formData.link.trim()
    ) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        image: formData.image,
        title: formData.title,
        niche: formData.niche || null,
        link: formData.link,
        uploadDate: formData.uploadDate ?? null,
        stars: formData.stars ?? null,
        buyPrice: formData.buyPrice ?? null,
        sellPrice: formData.sellPrice ?? null,
        totalSales: formData.totalSales ?? null,
        countries: selectedCountries,
      };

      if (editingProduct?.id) {
        await updateProduct({ id: editingProduct.id, ...productData });
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully");
      }

      // Refresh products
      const updatedProducts = await getAllProducts();
      setProducts(updatedProducts);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        editingProduct
          ? "Failed to update product"
          : "Failed to create product",
      );
      console.error("❌ Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("❌ Error deleting product:", error);
      }
    }
  };

  // 🌍 Handle country selection
  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryCode)
        ? prev.filter((code) => code !== countryCode)
        : [...prev, countryCode],
    );
  };

  // 📝 Handle input change
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🎨 Render country badges
  const renderCountryBadges = (countryCodes: string[]) => {
    if (!countryCodes || countryCodes.length === 0) {
      return <span className="text-xs italic text-gray-500">Global</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {countryCodes.slice(0, 3).map((code) => {
          const country = countryOptions.find((c) => c.value === code);
          return (
            <div
              key={code}
              className="relative h-4 w-4 overflow-hidden rounded-sm"
            >
              <Image
                src={(country?.icon as string) || "/placeholder.svg"}
                alt={country?.label || code}
                fill
                className="object-cover"
              />
            </div>
          );
        })}
        {countryCodes.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{countryCodes.length - 3}
          </Badge>
        )}
      </div>
    );
  };

  // 📤 Handle Export
  const handleExport = () => {
    if (products.length === 0) {
      toast.error("No products to export");
      return;
    }

    // Strip IDs and system fields
    const exportData = products.map(
      ({ id, createdAt, updatedAt, ...rest }) => rest,
    );

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `products-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${products.length} products`);
  };

  // 📥 Handle Import Trigger
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // 📂 Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input to allow selecting same file again
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setIsLoading(true);
        const result = await importProducts(json);
        toast.success(`Imported: ${result.count}\nErrors: ${result.errors}`);
        const updatedProducts = await getAllProducts();
        setProducts(updatedProducts);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Import failed");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* ✨ Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Top Products Management
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Add, edit, and manage featured products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />
          <Button
            variant="outline"
            onClick={handleImportClick}
            disabled={isLoading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import JSON
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading || products.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? "Update product details"
                    : "Fill in the details to add a new product"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* 🖼️ Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL *</Label>
                    <div className="relative">
                      <Input
                        id="image"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) =>
                          handleInputChange("image", e.target.value)
                        }
                        required
                      />
                      <ImageIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 🏷️ Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Product title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* 🎯 Niche */}
                  <div className="space-y-2">
                    <Label htmlFor="niche">Niche</Label>
                    <div className="relative">
                      <Input
                        id="niche"
                        placeholder="Product category"
                        value={formData.niche || ""}
                        onChange={(e) =>
                          handleInputChange("niche", e.target.value)
                        }
                      />
                      <Tag className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 🔗 Link */}
                  <div className="space-y-2">
                    <Label htmlFor="link">Product Link *</Label>
                    <div className="relative">
                      <Input
                        id="link"
                        placeholder="https://example.com/product"
                        value={formData.link}
                        onChange={(e) =>
                          handleInputChange("link", e.target.value)
                        }
                        required
                      />
                      <LinkIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* ⭐ Stars */}
                  <div className="space-y-2">
                    <Label htmlFor="stars">Rating (0-5)</Label>
                    <div className="relative">
                      <Input
                        id="stars"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="4.5"
                        value={formData.stars || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "stars",
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : null,
                          )
                        }
                      />
                      <Star className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 💰 Buy Price */}
                  <div className="space-y-2">
                    <Label htmlFor="buyPrice">Buy Price</Label>
                    <div className="relative">
                      <Input
                        id="buyPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="29.99"
                        value={formData.buyPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "buyPrice",
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : null,
                          )
                        }
                      />
                      <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 💲 Sell Price */}
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Sell Price</Label>
                    <div className="relative">
                      <Input
                        id="sellPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="49.99"
                        value={formData.sellPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "sellPrice",
                            e.target.value
                              ? Number.parseFloat(e.target.value)
                              : null,
                          )
                        }
                      />
                      <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 📈 Total Sales */}
                  <div className="space-y-2">
                    <Label htmlFor="totalSales">Monthly Sales</Label>
                    <div className="relative">
                      <Input
                        id="totalSales"
                        type="number"
                        min="0"
                        placeholder="1000"
                        value={formData.totalSales || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "totalSales",
                            e.target.value
                              ? Number.parseInt(e.target.value)
                              : null,
                          )
                        }
                      />
                      <BarChart3 className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 📅 Upload Date */}
                  <div className="space-y-2">
                    <Label htmlFor="uploadDate">Upload Date</Label>
                    <div className="relative">
                      <Input
                        id="uploadDate"
                        type="date"
                        value={
                          formData.uploadDate
                            ? format(
                                new Date(formData.uploadDate),
                                "yyyy-MM-dd",
                              )
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "uploadDate",
                            e.target.value ? new Date(e.target.value) : null,
                          )
                        }
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* 🌍 Countries Dropdown */}
                <div className="space-y-2">
                  <Label>Countries</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-transparent"
                      >
                        <span>
                          {selectedCountries.length > 0
                            ? `${selectedCountries.length} countries selected`
                            : "Select countries"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80">
                      <ScrollArea className="h-72">
                        {countryOptions.map((country) => (
                          <DropdownMenuCheckboxItem
                            key={country.value}
                            checked={selectedCountries.includes(country.value)}
                            onCheckedChange={() =>
                              handleCountryToggle(country.value)
                            }
                            className="flex items-center gap-2"
                          >
                            <div className="relative h-4 w-4 flex-shrink-0">
                              <Image
                                src={
                                  (country.icon as string) || "/placeholder.svg"
                                }
                                alt={country.label}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="truncate">{country.label}</span>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Selected countries display */}
                  {selectedCountries.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCountries.map((code) => {
                        const country = countryOptions.find(
                          (c) => c.value === code,
                        );
                        return (
                          <Badge
                            key={code}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <div className="relative h-3 w-3">
                              <Image
                                src={
                                  (country?.icon as string) ||
                                  "/placeholder.svg"
                                }
                                alt={country?.label || code}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span>{country?.label}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleCountryToggle(code)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
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
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {/* 📋 Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your product collection</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">No products found</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Niche</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Countries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-10 w-10 overflow-hidden rounded">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate">
                          {product.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.niche || (
                          <span className="text-xs italic text-gray-500">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.sellPrice ? (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              ${product.sellPrice.toFixed(2)}
                            </span>
                            {product.buyPrice && (
                              <span className="text-xs text-gray-500">
                                Buy: ${product.buyPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs italic text-gray-500">
                            Not set
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.stars !== null &&
                        product.stars !== undefined ? (
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.stars.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-xs italic text-gray-500">
                            Not rated
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {renderCountryBadges(product.countries)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
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
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
