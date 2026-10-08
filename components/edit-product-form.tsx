"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProduct } from "@/app/actions";
import { PencilIcon, Loader2Icon } from "lucide-react";
import type { Product } from "@/components/products-data-table";

const updateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  gender: z.enum(["Men", "Women", "Unisex"]),
  summary: z.string().optional(),
  description: z.string().optional(),
});

type UpdateProductFormValues = z.infer<typeof updateProductSchema>;

interface EditProductDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditProductDialog({
  product,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: product.quantity,
      gender: product.gender,
      summary: product.summary || "",
      description: product.description || "",
    },
  });

  React.useEffect(() => {
    form.reset({
      name: product.name,
      brand: product.brand,
      price: product.price,
      quantity: product.quantity,
      gender: product.gender,
      summary: product.summary || "",
      description: product.description || "",
    });
  }, [product, form]);

  const onSubmit = async (data: UpdateProductFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await updateProduct(product._id, {
        name: data.name,
        brand: data.brand,
        price: data.price,
        quantity: data.quantity,
        gender: data.gender,
        summary: data.summary,
        description: data.description,
      });

      if (res.success) {
        toast.success("Product updated successfully");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to update product");
      }
    } catch {
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update inventory pricing, stock, and descriptions for {product.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="prodEditName">Product Name *</Label>
              <Input
                id="prodEditName"
                {...form.register("name")}
                placeholder="Product title"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodEditBrand">Brand *</Label>
                <Input
                  id="prodEditBrand"
                  {...form.register("brand")}
                  placeholder="Nike, Adidas, etc."
                />
                {form.formState.errors.brand && (
                  <p className="text-xs text-destructive">{form.formState.errors.brand.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodEditGender">Target Gender *</Label>
                <Select
                  value={form.watch("gender")}
                  onValueChange={(val: any) => form.setValue("gender", val)}
                >
                  <SelectTrigger id="prodEditGender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="prodEditPrice">Price (KES) *</Label>
                <Input
                  id="prodEditPrice"
                  type="number"
                  {...form.register("price", { valueAsNumber: true })}
                />
                {form.formState.errors.price && (
                  <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodEditQty">Stock Quantity *</Label>
                <Input
                  id="prodEditQty"
                  type="number"
                  {...form.register("quantity", { valueAsNumber: true })}
                />
                {form.formState.errors.quantity && (
                  <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prodEditSummary">Short Summary</Label>
              <Input
                id="prodEditSummary"
                {...form.register("summary")}
                placeholder="High-performance running shoe"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="prodEditDesc">Detailed Description</Label>
              <Textarea
                id="prodEditDesc"
                {...form.register("description")}
                rows={3}
                placeholder="Full product overview, material, comfort details..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditProductForm({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(true)}
      >
        <PencilIcon className="h-4 w-4" />
        <span className="sr-only">Edit Product</span>
      </Button>
      <EditProductDialog
        product={product}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
