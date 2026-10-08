"use client"
import Recipt04, { ReceiptItem } from "@/components/shadcn-space/blocks/receipt-04/receipt";

const items: ReceiptItem[] = [
  {
    id: "wireless-headphone",
    image:
      "https://images.shadcnspace.com/assets/ecommerce/product-comparison/product-comparison-1-1.webp",
    title: "Wireless Headphone",
    variant: "Charcoal · 210g · Qty 1",
    price: 145.0,
  },
  {
    id: "beige-jacket",
    image:
      "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-01-img-1.webp",
    title: "Beige Jacket",
    variant: "Green · 150g · Qty 1",
    price: 189.0,
  },
  {
    id: "the-echo-series",
    image:
      "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-06-img-1.webp",
    title: "The Echo Series",
    variant: "Brown · 240g · Qty 1",
    price: 65.0,
  },
];

const Recipt04Block = () => {
  return <Recipt04 items={items} />;
};

export default Recipt04Block;
