"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize the stateless Convex HTTP Client using your environment variables
const convexHttp = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface FilterParams {
    categorySlug?: string;
    gender?: "Men" | "Women" | "Unisex";
    minPrice?: number;
    maxPrice?: number;
}

/**
 * Server Action: Fetches all filterable categories
 */
export async function fetchCategoriesAction() {
    try {
        return await convexHttp.query(api.products.getCategories);
    } catch (error) {
        console.error("Failed to fetch categories via Server Action:", error);
        throw new Error("Unable to retrieve categories.");
    }
}

/**
 * Server Action: Fetches products based on live filtering states
 */
export async function fetchFilteredProductsAction(filters: FilterParams) {
    try {
        return await convexHttp.query(api.products.getFilteredProducts, {
            categorySlug: filters.categorySlug || undefined,
            gender: filters.gender || undefined,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
        });
    } catch (error) {
        console.error("Failed to fetch filtered products via Server Action:", error);
        throw new Error("Unable to fetch filtered items.");
    }
}
