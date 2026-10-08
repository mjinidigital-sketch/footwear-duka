import {
  isAuthenticatedNextjs,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { ProductsDataTable } from "@/components/products-data-table";
import { getProductsAdmin } from "@/app/actions";
import type { Product } from "@/components/products-data-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  const authenticated = await isAuthenticatedNextjs();
  if (!authenticated) {
    redirect("/login");
  }

  const user = await fetchQuery(
    api.users.viewer,
    {},
    { token: await convexAuthNextjsToken() },
  );

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Fetch products from server action with error handling
  const products = await getProductsAdmin();

  // Transform products to match the Product schema
  const transformedProducts: Product[] = products.map((p: any) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    summary: p.summary,
    categoryId: p.categoryId,
    categorySlug: p.categorySlug,
    brand: p.brand,
    colors: p.colors,
    sizes: p.sizes,
    gender: p.gender,
    description: p.description,
    mainImage: p.mainImage,
    gallery: p.gallery,
    price: p.price,
    quantity: p.quantity,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    isActive: p.isActive ?? true,
    featured: p.featured ?? false,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">
                Manage your product inventory
              </p>
            </div>
            <ProductsDataTable data={transformedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
