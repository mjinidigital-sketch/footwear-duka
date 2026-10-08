import z from "zod";

const productSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    summary: z.string().min(1, "Summary is required"),

    // Relationship to categories table (Expects the Convex ID string)
    categoryId: z.string().min(1, "Category ID is required"),
    categorySlug: z.string().min(1, "Category slug is required"),
    brand: z.string().min(1, "Brand is required"),

    // Updated to match your color variant images array structure
    colors: z.array(
        z.object({
            name: z.string().min(1, "Color name is required"),
            hex: z.string().min(1, "Hex code is required"),
            images: z.array(z.string().url("Must be a valid image URL").or(z.string().min(1))),
        })
    ).min(1, "At least one color variant is required"),

    sizes: z.array(z.number()).min(1, "At least one size is required"),
    gender: z.union([
        z.literal("Men"),
        z.literal("Women"),
        z.literal("Unisex")
    ]),
    description: z.string(),

    mainImage: z.string().min(1, "Main thumbnail image is required"),
    gallery: z.array(z.string()).default([]),

    price: z.number().positive("Price must be greater than 0"),
    quantity: z.number().int().nonnegative("Quantity cannot be negative"),
    compareAtPrice: z.number().optional(),
});

export type ProductSchema = z.infer<typeof productSchema>;
export default productSchema;
