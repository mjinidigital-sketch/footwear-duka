"use server";

import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export async function getProductBySlug(slug: string) {
    const product = await fetchQuery(
        api.products.getBySlug,
        { slug }
    );

    return product;
}
