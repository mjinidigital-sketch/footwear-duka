import { cache } from "react";
import { unstable_cache } from "next/cache";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const getProductsCached = unstable_cache(
  async () => {
    return await fetchQuery(
      api.products.listProducts,
      {}
    );
  },
  ["products"],
  {
    revalidate: 1, // Very short cache time (1 second) to fetch fresh data
    tags: ["products"],
  }
);

export const getProducts = cache(async () => {
  return getProductsCached();
});
