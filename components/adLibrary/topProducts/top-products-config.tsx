"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/actions/top-products";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  DollarSign,
  Globe,
  ImageIcon,
  LinkIcon,
  Loader2,
  Pencil,
  Plus,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { countryCodesAlpha2Flag } from "../searchFilters/filter-config";

// ========================================
//        📋 Schema Validation 📋
// ========================================
const productSchema = z.object({
  id: z.string().optional(),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  niche: z.string().optional().nullable(),
  link: z.string().url({ message: "Please enter a valid URL" }),
  uploadDate: z.date().optional().nullable(),
  stars: z
    .number()
    .min(0, { message: "Stars must be at least 0" })
    .max(5, { message: "Stars must be at most 5" })
    .optional()
    .nullable(),
  buyPrice: z
    .number()
    .min(0, { message: "Buy price must be at least 0" })
    .optional()
    .nullable(),
  sellPrice: z
    .number()
    .min(0, { message: "Sell price must be at least 0" })
    .optional()
    .nullable(),
  totalSales: z
    .number()
    .int({ message: "Total sales must be an integer" })
    .min(0, { message: "Total sales must be at least 0" })
    .optional()
    .nullable(),
  countries: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ========================================
//        🧩 Main Component 🧩
// ========================================
export default function TopProductsConfig() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductFormValues | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState<string>("");

  // Filter countries by search query
  const filteredCountryCodes = countryCodesAlpha2Flag.filter(
    (country) =>
      country.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.value.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  // ✨ Initialize form with react-hook-form and zod validation
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      image: "",
      title: "",
      niche: "",
      link: "",
      stars: null,
      buyPrice: null,
      sellPrice: null,
      totalSales: null,
      countries: [],
    },
  });

  // 📥 Fetch products on component mount
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

  // 🔄 Reset form when dialog closes or editing state changes
  useEffect(() => {
    if (editingProduct) {
      form.reset({
        ...editingProduct,
        // Convert string dates to Date objects if needed
        uploadDate: editingProduct.uploadDate
          ? new Date(editingProduct.uploadDate as unknown as string)
          : null,
      });
      setSelectedCountries(editingProduct.countries || []);
    } else {
      form.reset({
        image: "",
        title: "",
        niche: "",
        link: "",
        stars: null,
        buyPrice: null,
        sellPrice: null,
        totalSales: null,
        countries: [],
      });
      setSelectedCountries([]);
    }
  }, [editingProduct, form]);

  // 💾 Handle form submission (create or update)
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Include selected countries in the form data
      const productData = {
        ...data,
        countries: selectedCountries,
      };

      if (editingProduct?.id) {
        // Update existing product
        await updateProduct({
          id: editingProduct.id,
          ...productData,
        } as UpdateProductInput);
        toast.success("Product updated successfully");
      } else {
        // Create new product
        await createProduct(productData as CreateProductInput);
        toast.success("Product created successfully");
      }

      // Refresh product list
      const updatedProducts = await getAllProducts();
      setProducts(updatedProducts);

      // Close dialog and reset form
      setIsDialogOpen(false);
      setEditingProduct(null);
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

  // 🗑️ Handle product deletion
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

  // 🎨 Render country badges with flags
  const renderCountryBadges = (countryCodes: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {countryCodes.map((code) => {
          const country = countryCodesAlpha2Flag.find((c) => c.value === code);
          return (
            <TooltipProvider key={code}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* <Badge variant="outline" className="flex items-center gap-1"> */}
                  {country ? (
                    <>
                      <div className="relative h-4 w-4">
                        <Image
                          src={country.icon as string}
                          alt={country.label}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* <span className="text-xs">{code}</span> */}
                    </>
                  ) : (
                    code
                  )}
                  {/* </Badge> */}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{country?.label || code}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ✨ Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-3xl font-bold text-transparent">
            Top Products Management
          </h2>
          <p className="mt-1 text-muted-foreground">
            Add, edit, and manage featured products for your platform
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingProduct(null)}
              className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] transition-opacity hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[95dvh] max-h-[95dvh] w-full max-w-[80vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the details of an existing product"
                  : "Fill in the details to add a new product to your collection"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* 🖼️ Image URL */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                            <ImageIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 🏷️ Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Product title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 틈️ Niche */}
                  <FormField
                    control={form.control}
                    name="niche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niche (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Product category or niche"
                              {...field}
                              value={field.value || ""}
                            />
                            <Tag className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 🔗 Link */}
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Link</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="https://example.com/product"
                              {...field}
                            />
                            <LinkIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ⭐ Stars */}
                  <FormField
                    control={form.control}
                    name="stars"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stars (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              placeholder="4.5"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null;
                                field.onChange(value);
                              }}
                            />
                            <Star className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Rating out of 5 stars
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 💰 Buy Price */}
                  <FormField
                    control={form.control}
                    name="buyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buy Price (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="29.99"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null;
                                field.onChange(value);
                              }}
                            />
                            <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 💲 Sell Price */}
                  <FormField
                    control={form.control}
                    name="sellPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sell Price (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="49.99"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null;
                                field.onChange(value);
                              }}
                            />
                            <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 📈 Total Sales */}
                  <FormField
                    control={form.control}
                    name="totalSales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Sales (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="1000"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const value = e.target.value
                                  ? Number.parseInt(e.target.value, 10)
                                  : null;
                                field.onChange(value);
                              }}
                            />
                            <BarChart3 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Estimated monthly sales
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 📅 Upload Date */}
                  <FormField
                    control={form.control}
                    name="uploadDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Date (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value
                                  ? format(new Date(field.value), "yyyy-MM-dd")
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value
                                  ? new Date(e.target.value)
                                  : null;
                                field.onChange(value);
                              }}
                            />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 🌍 Countries */}
                <div>
                  <FormLabel className="mb-2 block">
                    Countries (Optional)
                  </FormLabel>
                  <div className="mb-2 flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Select countries where this product is available
                    </p>
                  </div>

                  {/* Country dropdown */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="mb-2 w-[30%] justify-between"
                      >
                        <span>Select countries</span>
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <div className="p-2">
                        <Input
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="mb-2"
                        />
                        <ScrollArea className="h-72">
                          {filteredCountryCodes.map((country) => (
                            <div
                              key={country.value}
                              className={`flex cursor-pointer items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-muted ${
                                selectedCountries.includes(country.value)
                                  ? "bg-purple-100 dark:bg-purple-900"
                                  : ""
                              }`}
                              onClick={() => handleCountryToggle(country.value)}
                            >
                              <div className="relative h-5 w-5 flex-shrink-0">
                                <Image
                                  src={country.icon as string}
                                  alt={country.label}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="truncate text-sm">
                                {country.label}
                              </span>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Selected countries display */}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedCountries.length > 0 ? (
                      selectedCountries.map((code) => {
                        const country = countryCodesAlpha2Flag.find(
                          (c) => c.value === code,
                        );
                        return (
                          <Badge
                            key={code}
                            variant="secondary"
                            className="flex items-center gap-0 px-1"
                          >
                            <div className="relative h-4 w-4">
                              <Image
                                src={country?.icon as string}
                                alt={country?.label || code}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="ml-1 mr-1">{country?.label}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => handleCountryToggle(code)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </Badge>
                        );
                      })
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        No countries selected
                      </p>
                    )}
                  </div>
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
                    className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] transition-opacity hover:opacity-90"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-6" />

      {/* 📋 Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your top products collection</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#6566F1]" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">No products found</p>
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
                          <span className="text-xs italic text-muted-foreground">
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
                              <span className="text-xs text-muted-foreground">
                                Buy: ${product.buyPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs italic text-muted-foreground">
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
                          <span className="text-xs italic text-muted-foreground">
                            Not rated
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.countries && product.countries.length > 0 ? (
                          renderCountryBadges(product.countries)
                        ) : (
                          <span className="text-xs italic text-muted-foreground">
                            Global
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit product</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                  className="text-destructive hover:text-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete product</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
