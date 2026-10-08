"use client";

import Link from "next/link";
import { memo, useState } from "react";
import {
    ArrowUpRight,
    Check,
    ChevronDown,
    Heart,
    ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCart } from "@/contexts/CartContext";

/* =========================================================
   PRODUCT TYPE — MATCHES YOUR CONVEX SCHEMA
========================================================= */

export interface ProductCardProduct {
    _id: string;
    _creationTime: number;

    name: string;
    slug: string;
    summary: string;

    categoryId: string;
    categorySlug: string;

    brand: string;

    colors: {
        name: string;
        hex: string;
        images: string[];
    }[];

    sizes: number[];

    gender: "Men" | "Women" | "Unisex";

    description: string;

    mainImage: string;
    gallery: string[];

    price: number;
    quantity: number;
}

interface ProductCardProps {
    product: ProductCardProduct;
}

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = memo(function ProductCard({
    product,
}: ProductCardProps) {
    const [selectedColor, setSelectedColor] = useState(
        product.colors?.[0] ?? null
    );

    const [selectedSize, setSelectedSize] = useState<number | null>(
        product.sizes?.[0] ?? null
    );

    const [sizeOpen, setSizeOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();

    /* ---------------------------------------------------------
       IMAGE
    --------------------------------------------------------- */

    const selectedImage =
        selectedColor?.images?.[0] ||
        product.mainImage ||
        product.gallery?.[0];

    /* ---------------------------------------------------------
       STOCK
    --------------------------------------------------------- */

    const isOutOfStock = product.quantity <= 0;

    /* ---------------------------------------------------------
       PRICE
    --------------------------------------------------------- */

    const formattedPrice = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(product.price);

    /* ---------------------------------------------------------
       ADD TO CART
    --------------------------------------------------------- */

    async function handleAddToCart() {
        if (
            isOutOfStock ||
            !selectedColor ||
            selectedSize === null
        ) {
            return;
        }

        const cartItem = {
            productId: product._id,
            price: product.price,
            quantity: 1,
            size: selectedSize,
            color: selectedColor.name,
        };

        setIsAdding(true);

        try {
            await addToCart(cartItem);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setIsAdding(false);
        }
    }

    return (
        <article
            className="
                group relative overflow-hidden rounded-xl
                border bg-background
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
            "
        >
            {/* =====================================================
                IMAGE
            ====================================================== */}

            <div className="relative aspect-[4/4.5] overflow-hidden bg-muted">
                <Link
                    href={`/product/${product.slug}`}
                    className="block h-full w-full"
                    aria-label={`View ${product.name}`}
                >
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt={product.name}
                            loading="lazy"
                            className="
                                h-full w-full object-cover
                                transition-transform duration-500
                                group-hover:scale-[1.04]
                            "
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No image
                        </div>
                    )}
                </Link>

                {/* Top badges */}

                <div className="absolute left-2 top-2">
                    {isOutOfStock ? (
                        <Badge
                            variant="destructive"
                            className="rounded-full px-2 py-0.5 text-[10px]"
                        >
                            Sold out
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="
                                rounded-full
                                bg-white/90
                                px-2 py-0.5
                                text-[10px]
                                backdrop-blur-sm
                                dark:bg-black/70
                            "
                        >
                            {product.gender}
                        </Badge>
                    )}
                </div>

                {/* Wishlist */}

                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="
                        absolute right-2 top-2
                        h-8 w-8
                        rounded-full
                        border
                        bg-white/90
                        shadow-sm
                        backdrop-blur-sm
                        hover:bg-white
                        dark:bg-black/70
                    "
                    aria-label={`Add ${product.name} to wishlist`}
                >
                    <Heart className="h-3.5 w-3.5" />
                </Button>

                {/* Desktop hover link */}

                <Link
                    href={`/product/${product.slug}`}
                    className="
                        absolute bottom-3 left-1/2
                        flex -translate-x-1/2 translate-y-2
                        items-center gap-1.5
                        whitespace-nowrap
                        rounded-full
                        bg-white
                        px-3 py-1.5
                        text-xs font-medium text-black
                        shadow-md
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                    "
                >
                    View product
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <div className="p-3.5">
                {/* Brand */}

                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {product.brand}
                </p>

                {/* Product name */}

                <Link
                    href={`/product/${product.slug}`}
                    className="mt-0.5 block"
                >
                    <h3 className="truncate text-sm font-semibold tracking-tight hover:text-primary">
                        {product.name}
                    </h3>
                </Link>

                {/* Summary */}

                <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-muted-foreground">
                    {product.summary}
                </p>

                {/* Price */}

                <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-base font-bold">
                        {formattedPrice}
                    </span>

                    {!isOutOfStock && (
                        <span className="text-[10px] font-medium text-green-600">
                            In stock
                        </span>
                    )}
                </div>

                {/* =================================================
                    COLORS
                ================================================== */}

                {product.colors?.length > 0 && (
                    <div className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[10px] font-medium">
                                Color
                            </span>

                            {selectedColor && (
                                <span className="max-w-[120px] truncate text-[10px] text-muted-foreground">
                                    {selectedColor.name}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {product.colors.map((color) => {
                                const isSelected =
                                    selectedColor?.name ===
                                    color.name;

                                return (
                                    <button
                                        key={`${product._id}-${color.name}`}
                                        type="button"
                                        title={color.name}
                                        aria-label={`Select ${color.name}`}
                                        aria-pressed={isSelected}
                                        disabled={isOutOfStock}
                                        onClick={() =>
                                            setSelectedColor(color)
                                        }
                                        className={[
                                            "relative h-6 w-6 rounded-full border transition-all",
                                            "hover:scale-110",
                                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                                            isSelected
                                                ? "border-primary ring-1 ring-primary ring-offset-1"
                                                : "border-border",
                                        ].join(" ")}
                                        style={{
                                            backgroundColor:
                                                color.hex,
                                        }}
                                    >
                                        {isSelected && (
                                            <Check
                                                className="absolute inset-0 m-auto h-3 w-3"
                                                style={{
                                                    color:
                                                        color.hex.toLowerCase() ===
                                                            "#fff" ||
                                                            color.hex.toLowerCase() ===
                                                            "#ffffff"
                                                            ? "#000"
                                                            : "#fff",
                                                }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* =================================================
                    COLLAPSIBLE SIZE
                ================================================== */}

                {product.sizes?.length > 0 && (
                    <Collapsible
                        open={sizeOpen}
                        onOpenChange={setSizeOpen}
                        className="mt-3 rounded-lg border"
                    >
                        <CollapsibleTrigger asChild>
                            <button
                                type="button"
                                className="
                                    flex w-full
                                    items-center justify-between
                                    px-3 py-2
                                    text-left
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium">
                                        Size
                                    </span>

                                    {selectedSize !== null && (
                                        <span className="text-[10px] text-muted-foreground">
                                            EU {selectedSize}
                                        </span>
                                    )}
                                </div>

                                <ChevronDown
                                    className={[
                                        "h-3.5 w-3.5 text-muted-foreground",
                                        "transition-transform duration-200",
                                        sizeOpen
                                            ? "rotate-180"
                                            : "",
                                    ].join(" ")}
                                />
                            </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <div className="border-t px-3 pb-3 pt-2.5">
                                <div className="mb-2 text-[9px] text-muted-foreground">
                                    Select your EU size
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {product.sizes.map((size) => {
                                        const isSelected =
                                            selectedSize === size;

                                        return (
                                            <button
                                                key={`${product._id}-${size}`}
                                                type="button"
                                                aria-label={`Select size ${size}`}
                                                aria-pressed={isSelected}
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setSizeOpen(false);
                                                }}
                                                className={[
                                                    "min-w-10 rounded-md border px-2 py-1.5 text-[10px] font-medium transition",
                                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                                                    isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border hover:border-primary hover:bg-muted",
                                                ].join(" ")}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* =================================================
                    ACTIONS
                ================================================== */}

                <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button

                        variant="outline"
                        className="h-9 rounded-lg px-2 text-[11px]"
                    >
                        <Link
                            href={`/product/${product.slug}`}
                        >
                            View
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        className="h-9 rounded-lg px-2 text-[11px]"
                        disabled={
                            isOutOfStock ||
                            !selectedColor ||
                            selectedSize === null ||
                            isAdding
                        }
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />

                        {isAdding
                            ? "Adding..."
                            : isOutOfStock
                                ? "Sold out"
                                : "Add"}
                    </Button>
                </div>
            </div>
        </article>
    );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
