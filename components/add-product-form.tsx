"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, Loader2Icon, XIcon, ImageIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react"

const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  categorySlug: z.string().min(1, "Category slug is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  mainImage: z.string().url("Main image must be a valid URL"),
  gallery: z.array(z.string().url()).optional(),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  compareAtPrice: z.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.number().optional(),
  material: z.string().optional(),
  season: z.string().optional(),
  gender: z.union([z.literal("Men"), z.literal("Women"), z.literal("Unisex")]),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
    images: z.array(z.string().url()).optional(),
  })).min(1, "At least one color variant is required"),
  sizes: z.array(z.number()).min(1, "At least one size is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  googleProductCategory: z.string().optional(),
  condition: z.union([z.literal("new"), z.literal("refurbished"), z.literal("used")]).optional(),
  availability: z.union([z.literal("in_stock"), z.literal("out_of_stock"), z.literal("preorder")]).optional(),
  shippingWeight: z.number().optional(),
  shippingLabel: z.string().optional(),
})

type CreateProductFormValues = z.infer<typeof createProductSchema>

interface ColorVariant {
  name: string
  hex: string
  images: string[]
}

export function AddProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [categories, setCategories] = React.useState<Array<{ _id: string; name: string; slug: string }>>([])
  const [colorVariants, setColorVariants] = React.useState<ColorVariant[]>([
    { name: "", hex: "#000000", images: [] }
  ])
  const [sizes, setSizes] = React.useState<number[]>([40, 41, 42, 43, 44])
  const [galleryImages, setGalleryImages] = React.useState<string[]>([])
  const [keywords, setKeywords] = React.useState<string[]>([])
  const [keywordInput, setKeywordInput] = React.useState("")
  const scrollContentRef = React.useRef<HTMLDivElement>(null)

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      summary: "",
      categoryId: "",
      categorySlug: "",
      brand: "",
      description: "",
      mainImage: "",
      gallery: [],
      price: 0,
      quantity: 0,
      gender: "Unisex",
      colors: colorVariants,
      sizes: sizes,
      condition: "new",
      availability: "in_stock",
    },
  })

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { getCategoriesAdmin } = await import("@/app/actions")
        const cats = await getCategoriesAdmin()
        setCategories(cats)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const addColorVariant = () => {
    setColorVariants([...colorVariants, { name: "", hex: "#000000", images: [] }])
  }

  const removeColorVariant = (index: number) => {
    if (colorVariants.length > 1) {
      setColorVariants(colorVariants.filter((_, i) => i !== index))
    }
  }

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: any) => {
    const updated = [...colorVariants]
    updated[index] = { ...updated[index], [field]: value }
    setColorVariants(updated)
  }

  const addSize = () => {
    const newSize = sizes.length > 0 ? Math.max(...sizes) + 1 : 40
    setSizes([...sizes, newSize])
  }

  const removeSize = (size: number) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((s) => s !== size))
    }
  }

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, ""])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
  }

  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...galleryImages]
    updated[index] = value
    setGalleryImages(updated)
  }

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const onSubmit = async (data: CreateProductFormValues) => {
    setIsSubmitting(true)
    try {
      const productData = {
        ...data,
        colors: colorVariants,
        sizes: sizes,
        gallery: galleryImages.filter((url) => url.trim() !== ""),
        metaKeywords: keywords,
      }
      
      const { createProduct } = await import("@/app/actions")
      const result = await createProduct(productData)
      
      if (result.success) {
        toast.success("Product created successfully")
        form.reset()
        setColorVariants([{ name: "", hex: "#000000", images: [] }])
        setSizes([40, 41, 42, 43, 44])
        setGalleryImages([])
        setKeywords([])
        setIsOpen(false)
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to create product")
      }
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || "An error occurred while creating the product"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline">Add Product</span>
      </Button>

      {/* Sidebar Form */}
      <div
        className={`bg-background fixed top-0 right-0 z-50 h-full w-full transform border-l shadow-xl transition-transform duration-300 sm:w-[800px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold">Add New Product</h2>
              <p className="text-muted-foreground text-sm">
                Create a new product with detailed information
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Form with Tabs */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
            <Tabs defaultValue="details" className="flex flex-1 flex-col">
              <div className="border-b px-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
              </div>

              <div className="relative flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <div
                  ref={scrollContentRef}
                  className="h-full overflow-y-auto p-4 scroll-smooth"
                  style={{ maxHeight: 'calc(100vh - 200px)' }}
                >
                  <div className="max-w-2xl mx-auto space-y-6 pb-20">
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            placeholder="AeroStride Marathoner v1"
                            {...form.register("name")}
                            onChange={(e) => {
                              form.setValue("name", e.target.value)
                              form.setValue("slug", generateSlug(e.target.value))
                            }}
                            disabled={isSubmitting}
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="slug">Slug *</Label>
                          <Input
                            id="slug"
                            placeholder="aerostride-marathoner-v1"
                            {...form.register("slug")}
                            disabled={isSubmitting}
                          />
                          {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="summary">Summary *</Label>
                        <textarea
                          id="summary"
                          placeholder="A brief summary of the product"
                          {...form.register("summary")}
                          disabled={isSubmitting}
                          rows={2}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {form.formState.errors.summary && (
                          <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={form.watch("categoryId")}
                            onValueChange={(value) => {
                              const cat = categories.find((c) => c._id === value)
                              form.setValue("categoryId", value ?? "")
                              form.setValue("categorySlug", cat?.slug ?? "")
                            }}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.categoryId && (
                            <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="brand">Brand *</Label>
                          <Input
                            id="brand"
                            placeholder="Nike, Adidas, etc."
                            {...form.register("brand")}
                            disabled={isSubmitting}
                          />
                          {form.formState.errors.brand && (
                            <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="gender">Gender *</Label>
                          <Select
                            value={form.watch("gender")}
                            onValueChange={(value) => form.setValue("gender", value as any)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Men">Men</SelectItem>
                              <SelectItem value="Women">Women</SelectItem>
                              <SelectItem value="Unisex">Unisex</SelectItem>
                            </SelectContent>
                          </Select>
                          {form.formState.errors.gender && (
                            <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="material">Material</Label>
                          <Input
                            id="material"
                            placeholder="Leather, Canvas, Mesh"
                            {...form.register("material")}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description *</Label>
                        <textarea
                          id="description"
                          placeholder="Detailed product description"
                          {...form.register("description")}
                          disabled={isSubmitting}
                          rows={6}
                          className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {form.formState.errors.description && (
                          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Color Variants *</Label>
                        {colorVariants.map((variant, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <Input
                                placeholder="Color name (e.g., Crimson Red)"
                                value={variant.name}
                                onChange={(e) => updateColorVariant(index, "name", e.target.value)}
                                disabled={isSubmitting}
                                className="flex-1"
                              />
                              <Input
                                type="color"
                                value={variant.hex}
                                onChange={(e) => updateColorVariant(index, "hex", e.target.value)}
                                disabled={isSubmitting}
                                className="h-10 w-16 p-1"
                              />
                              {colorVariants.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeColorVariant(index)}
                                  disabled={isSubmitting}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {variant.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="flex gap-2">
                                  <Input
                                    placeholder="Image URL"
                                    value={image}
                                    onChange={(e) => {
                                      const updated = [...variant.images]
                                      updated[imgIndex] = e.target.value
                                      updateColorVariant(index, "images", updated)
                                    }}
                                    disabled={isSubmitting}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const updated = variant.images.filter((_, i) => i !== imgIndex)
                                      updateColorVariant(index, "images", updated)
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  updateColorVariant(index, "images", [...variant.images, ""])
                                }}
                                disabled={isSubmitting}
                              >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Image
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addColorVariant}
                          disabled={isSubmitting}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Color
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Sizes *</Label>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => (
                            <div key={size} className="flex items-center gap-1">
                              <span className="px-3 py-1 bg-muted rounded">{size}</span>
                              {sizes.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeSize(size)}
                                  disabled={isSubmitting}
                                >
                                  <XIcon className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSize}
                          disabled={isSubmitting}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Size
                        </Button>
                      </div>
                    </TabsContent>

                    {/* SEO Tab */}
                    <TabsContent value="seo" className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          placeholder="SEO-friendly title"
                          {...form.register("metaTitle")}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <textarea
                          id="metaDescription"
                          placeholder="SEO-friendly description"
                          {...form.register("metaDescription")}
                          disabled={isSubmitting}
                          rows={3}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Meta Keywords</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add keyword"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                            disabled={isSubmitting}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addKeyword}
                            disabled={isSubmitting}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((keyword) => (
                            <div key={keyword} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                              {keyword}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => removeKeyword(keyword)}
                                disabled={isSubmitting}
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Google Merchant Tab */}
                    <TabsContent value="google" className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="googleProductCategory">Google Product Category</Label>
                        <Input
                          id="googleProductCategory"
                          placeholder="e.g., Apparel & Accessories > Shoes"
                          {...form.register("googleProductCategory")}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">Use Google's product taxonomy</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="condition">Condition</Label>
                          <Select
                            value={form.watch("condition")}
                            onValueChange={(value) => form.setValue("condition", value as any)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="condition">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="refurbished">Refurbished</SelectItem>
                              <SelectItem value="used">Used</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="availability">Availability</Label>
                          <Select
                            value={form.watch("availability")}
                            onValueChange={(value) => form.setValue("availability", value as any)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="availability">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in_stock">In Stock</SelectItem>
                              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                              <SelectItem value="preorder">Preorder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="shippingWeight">Shipping Weight (kg)</Label>
                          <Input
                            id="shippingWeight"
                            type="number"
                            step="0.1"
                            placeholder="0.5"
                            {...form.register("shippingWeight", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="shippingLabel">Shipping Label</Label>
                          <Select
                            value={form.watch("shippingLabel")}
                            onValueChange={(value) => form.setValue("shippingLabel", value ?? undefined)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="shippingLabel">
                              <SelectValue placeholder="Select label" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="heavy">Heavy</SelectItem>
                              <SelectItem value="oversize">Oversize</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Gallery Tab */}
                    <TabsContent value="gallery" className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="mainImage">Main Image *</Label>
                        <Input
                          id="mainImage"
                          placeholder="https://example.com/image.jpg"
                          {...form.register("mainImage")}
                          disabled={isSubmitting}
                        />
                        {form.formState.errors.mainImage && (
                          <p className="text-sm text-destructive">{form.formState.errors.mainImage.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Gallery Images</Label>
                        {galleryImages.map((url, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              value={url}
                              onChange={(e) => updateGalleryImage(index, e.target.value)}
                              disabled={isSubmitting}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGalleryImage(index)}
                              disabled={isSubmitting}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addGalleryImage}
                          disabled={isSubmitting}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Image
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Inventory Tab */}
                    <TabsContent value="inventory" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="price">Price (KES) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="6500"
                            {...form.register("price", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                          {form.formState.errors.price && (
                            <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="compareAtPrice">Compare At Price (Sale)</Label>
                          <Input
                            id="compareAtPrice"
                            type="number"
                            step="0.01"
                            placeholder="7500"
                            {...form.register("compareAtPrice", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="quantity">Quantity *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="15"
                            {...form.register("quantity", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                          {form.formState.errors.quantity && (
                            <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="sku">SKU</Label>
                          <Input
                            id="sku"
                            placeholder="PROD-001"
                            {...form.register("sku")}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="barcode">Barcode</Label>
                          <Input
                            id="barcode"
                            placeholder="1234567890123"
                            {...form.register("barcode")}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="0.5"
                            {...form.register("weight", { valueAsNumber: true })}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="season">Season</Label>
                        <Input
                          id="season"
                          placeholder="Spring/Summer, Fall/Winter"
                          {...form.register("season")}
                          disabled={isSubmitting}
                        />
                      </div>
                    </TabsContent>
                  </div>
                </div>

                {/* Scroll Buttons */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-lg"
                    onClick={() => {
                      scrollContentRef.current?.scrollBy({ top: -400, behavior: 'smooth' })
                    }}
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-lg"
                    onClick={() => {
                      scrollContentRef.current?.scrollBy({ top: 400, behavior: 'smooth' })
                    }}
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Tabs>

            {/* Footer */}
            <div className="flex gap-2 border-t p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
