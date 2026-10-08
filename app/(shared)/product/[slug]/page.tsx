import { notFound } from "next/navigation";

import ProductDetail from "@/components/blocks/ecommerce/product-overview/minimal-overview";
import { getProductBySlug } from "@/app/actions/product-actions";


type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
