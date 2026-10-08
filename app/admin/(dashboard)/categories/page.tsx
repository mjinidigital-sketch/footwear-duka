import {
  isAuthenticatedNextjs,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { CategoriesDataTable } from "@/components/categories-data-table";
import { getCategoriesAdmin } from "@/app/actions";
import type { Category } from "@/components/categories-data-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
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

  // Fetch categories from server action with error handling
  const categories = await getCategoriesAdmin();

  // Transform categories to match the Category schema
  const transformedCategories: Category[] = categories.map((c: any) => ({
    _id: c._id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    isActive: c.isActive ?? true,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground">
                Manage product categories
              </p>
            </div>
            <CategoriesDataTable data={transformedCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}
