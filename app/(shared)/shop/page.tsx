import { Suspense } from "react";
import ProductCatalog from "@/components/blocks/ecommerce/category-filters/ProductCatalog";
import { getProducts } from "@/lib/products";

type ShopPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;
    const products = await getProducts();

    return (
        <div className="mt-16 sm:mt-20">
            <Suspense fallback={
                <div className="min-h-screen py-24 text-center flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Loading footwear catalog...</p>
                </div>
            }>
                <ProductCatalog
                    products={products}
                    initialSearchParams={resolvedSearchParams}
                />
            </Suspense>
        </div>
    );
}
