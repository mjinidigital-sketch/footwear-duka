import ImageCarouselHero from "@/components/blocks/marketing/hero-sections/image-carousel-hero";
import CarouselPreview from "@/components/blocks/ecommerce/category-preview/carousel-preview";
import SplitImageFeatures from "@/components/blocks/ecommerce/product-features/split-image-features";
import EcommerceBentoHero from "@/components/bento";
import ProductCatalog from "@/components/blocks/ecommerce/category-filters/ProductCatalog";

import { getProducts } from "@/lib/products";
import ImmersiveOverview from "@/components/blocks/ecommerce/product-overview/immersive-overview";
import MinimalOverview from "@/components/blocks/ecommerce/product-overview/minimal-overview";

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <EcommerceBentoHero />

      <ProductCatalog products={products} />


      <ImageCarouselHero />

      <CarouselPreview />

      <SplitImageFeatures />
    </div>
  );
}
