import Recipt, { ReceiptItem } from "@/components/shadcn-space/blocks/receipt-01/receipt";

const items: ReceiptItem[] = [
  {
    id: "field-shell-jacket",
    image:
      "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-01-img-1.webp",
    title: "Field Shell Jacket",
    description: "Water-resistant outer shell",
    variant: "Olive · M · Qty 1",
    price: 49,
  },
  {
    id: "leather-crossbody-bag",
    image:
      "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-02-img-1.webp",
    title: "Leather Crossbody Bag",
    description: "Genuine full-grain leather",
    variant: "Slate · M · Qty 1",
    price: 65,
  },
  {
    id: "linen-field-shirt",
    image:
      "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-03-img-1.webp",
    title: "Linen Field Shirt",
    description: "100% organic linen fabric",
    variant: "Sand · M · Qty 2",
    price: 76,
  },
];

const Recipt01 = () => {
  return (
    <Recipt
      items={items}
      shippingCost={5}
      discountCode="WELCOME15"
      discountPercent={15}
      taxPercent={8.25}
    />
  );
};

export default Recipt01;
