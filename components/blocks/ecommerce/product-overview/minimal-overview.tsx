"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

type ProductColor = {
  name: string;
  hex: string;
  images: string[];
};

export type ProductDetailProduct = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  summary: string;
  description: string;
  price: number;
  quantity: number;
  gender: "Men" | "Women" | "Unisex";
  categorySlug: string;
  categoryId: string;
  mainImage: string;
  gallery: string[];
  sizes: number[];
  colors: ProductColor[];
};

type ProductDetailProps = {
  product: ProductDetailProduct;
};

export default function ProductDetail({
  product,
}: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  /*
   * ---------------------------------------------------------
   * NORMALIZED PRODUCT DATA
   * ---------------------------------------------------------
   */

  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];
  const gallery = product.gallery ?? [];

  const images = useMemo(() => {
    const colorImages = colors.flatMap(
      (color) => color.images ?? []
    );

    return Array.from(
      new Set(
        [
          product.mainImage,
          ...gallery,
          ...colorImages,
        ].filter(Boolean)
      )
    );
  }, [
    product.mainImage,
    gallery,
    colors,
  ]);

  /*
   * ---------------------------------------------------------
   * STATE
   * ---------------------------------------------------------
   */

  const [selectedColor, setSelectedColor] =
    useState<ProductColor | null>(
      colors[0] ?? null
    );

  const [selectedSize, setSelectedSize] =
    useState<number | null>(
      sizes[0] ?? null
    );

  const [selectedImage, setSelectedImage] =
    useState<string>(
      product.mainImage ||
      images[0] ||
      ""
    );

  const [quantity, setQuantity] = useState(1);

  const [isAdding, setIsAdding] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * SELECTED COLOR IMAGE
   * ---------------------------------------------------------
   */

  function handleColorChange(
    color: ProductColor
  ) {
    setSelectedColor(color);

    const colorImage =
      color.images?.[0];

    if (colorImage) {
      setSelectedImage(colorImage);
    }
  }

  /*
   * ---------------------------------------------------------
   * STOCK
   * ---------------------------------------------------------
   */

  const isOutOfStock =
    product.quantity <= 0;

  const maxQuantity = Math.max(
    product.quantity,
    1
  );

  /*
   * ---------------------------------------------------------
   * PRICE
   * ---------------------------------------------------------
   */

  const formattedPrice =
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(product.price);

  /*
   * ---------------------------------------------------------
   * QUANTITY
   * ---------------------------------------------------------
   */

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(
        maxQuantity,
        current + 1
      )
    );
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  /*
   * ---------------------------------------------------------
   * ADD TO CART
   * ---------------------------------------------------------
   */

  async function handleAddToCart() {
    if (
      isOutOfStock ||
      (sizes.length > 0 &&
        selectedSize === null) ||
      (colors.length > 0 &&
        !selectedColor)
    ) {
      return;
    }

    setIsAdding(true);

    try {
      await addToCart({
        productId: product._id,
        quantity,
        color: selectedColor?.name || 'Default',
        size: selectedSize || 40,
        price: product.price,
      });

      // Item added successfully - don't navigate, let user continue shopping
      // They can open cart drawer from navbar
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * IMAGE NAVIGATION
   * ---------------------------------------------------------
   */

  const currentImageIndex =
    Math.max(
      0,
      images.indexOf(selectedImage)
    );

  function previousImage() {
    if (images.length <= 1) return;

    const nextIndex =
      currentImageIndex <= 0
        ? images.length - 1
        : currentImageIndex - 1;

    setSelectedImage(
      images[nextIndex]
    );
  }

  function nextImage() {
    if (images.length <= 1) return;

    const nextIndex =
      currentImageIndex >=
        images.length - 1
        ? 0
        : currentImageIndex + 1;

    setSelectedImage(
      images[nextIndex]
    );
  }

  return (
    <main className="min-h-screen bg-background mt-24">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* =================================================
                    BREADCRUMB
                ================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="mb-5 overflow-hidden text-xs text-muted-foreground sm:mb-8"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>Shop</span>

            <ChevronRight className="h-3 w-3 shrink-0" />

            <span className="capitalize">
              {product.categorySlug}
            </span>

            <ChevronRight className="h-3 w-3 shrink-0" />

            <span className="max-w-[180px] truncate text-foreground sm:max-w-none">
              {product.name}
            </span>
          </div>
        </nav>

        {/* =================================================
                    PRODUCT HERO
                ================================================== */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14 xl:gap-20">

          {/* =================================================
                        PRODUCT MEDIA
                    ================================================== */}

          <section className="min-w-0 min-h-screen">

            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">

              {/* Thumbnails */}

              {images.length > 0 && (
                <div
                  className="
                                        order-2
                                        flex
                                        max-w-full
                                        gap-2
                                        overflow-x-auto
                                        pb-1
                                        md:order-1
                                        md:w-[76px]
                                        md:shrink-0
                                        md:flex-col
                                        md:overflow-x-visible
                                        md:overflow-y-auto
                                    "
                >
                  {images.map(
                    (
                      image,
                      index
                    ) => {
                      const active =
                        selectedImage ===
                        image;

                      return (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedImage(
                              image
                            )
                          }
                          aria-label={`View product image ${index +
                            1
                            }`}
                          aria-pressed={
                            active
                          }
                          className={`
                                                        relative
                                                        h-16
                                                        w-16
                                                        shrink-0
                                                        overflow-hidden
                                                        rounded-lg
                                                        border
                                                        bg-muted
                                                        transition-all
                                                        sm:h-[72px]
                                                        sm:w-[72px]
                                                        md:h-[70px]
                                                        md:w-[70px]
                                                        ${active
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
                            }
                                                    `}
                        >
                          <img
                            src={
                              image
                            }
                            alt={`${product.name} ${index +
                              1
                              }`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              )}

              {/* Main image */}

              <div className="order-1 min-w-0 flex-1 md:order-2">
                <div className="relative overflow-hidden rounded-2xl bg-muted">
                  <div className="aspect-square w-full">
                    {selectedImage ? (
                      <img
                        src={
                          selectedImage
                        }
                        alt={
                          product.name
                        }
                        className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition-transform
                                                    duration-500
                                                "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Image controls */}

                  {images.length >
                    1 && (
                      <>
                        <button
                          type="button"
                          onClick={
                            previousImage
                          }
                          aria-label="Previous product image"
                          className="
                                                    absolute
                                                    left-3
                                                    top-1/2
                                                    flex
                                                    h-9
                                                    w-9
                                                    -translate-y-1/2
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border
                                                    bg-white/90
                                                    shadow-sm
                                                    backdrop-blur
                                                    transition
                                                    hover:bg-white
                                                    dark:bg-black/70
                                                    dark:hover:bg-black/90
                                                "
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={
                            nextImage
                          }
                          aria-label="Next product image"
                          className="
                                                    absolute
                                                    right-3
                                                    top-1/2
                                                    flex
                                                    h-9
                                                    w-9
                                                    -translate-y-1/2
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border
                                                    bg-white/90
                                                    shadow-sm
                                                    backdrop-blur
                                                    transition
                                                    hover:bg-white
                                                    dark:bg-black/70
                                                    dark:hover:bg-black/90
                                                "
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {/* Image counter */}

                        <div className="
                                                absolute
                                                bottom-3
                                                right-3
                                                rounded-full
                                                bg-black/60
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-medium
                                                text-white
                                                backdrop-blur
                                            ">
                          {currentImageIndex +
                            1}{" "}
                          /{" "}
                          {
                            images.length
                          }
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
                        PRODUCT INFORMATION
                    ================================================== */}

          <section className="min-w-0 h-[600px] overflow-y-scroll sticky top-24 no-scrollbar">

            {/* Brand */}

            <p className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-muted-foreground
                            sm:text-xs
                        ">
              {product.brand}
            </p>

            {/* Name */}

            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="
                                text-2xl
                                font-semibold
                                leading-tight
                                tracking-tight
                                sm:text-3xl
                                lg:text-4xl
                            ">
                {product.name}
              </h1>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-10"
                aria-label={`Add ${product.name} to wishlist`}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Summary */}

            <p className="
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-6
                            text-muted-foreground
                            sm:mt-4
                            sm:text-base
                            sm:leading-7
                        ">
              {product.summary}
            </p>

            {/* Price / stock */}

            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
              <span className="
                                text-2xl
                                font-bold
                                tracking-tight
                                sm:text-3xl
                            ">
                {formattedPrice}
              </span>

              <span className={`
                                rounded-full
                                px-2.5
                                py-1
                                text-[10px]
                                font-medium
                                sm:text-xs
                                ${isOutOfStock
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                }
                            `}>
                {isOutOfStock
                  ? "Out of stock"
                  : `${product.quantity} in stock`}
              </span>
            </div>

            <div className="my-6 h-px bg-border sm:my-7" />

            {/* =================================================
                            COLOR
                        ================================================== */}

            {colors.length > 0 && (
              <div className="mb-6 sm:mb-7">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold">
                      Color
                    </span>

                    {selectedColor && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {selectedColor.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {colors.map(
                    (color) => {
                      const active =
                        selectedColor?.name ===
                        color.name;

                      const isWhite =
                        [
                          "#fff",
                          "#ffffff",
                        ].includes(
                          color.hex.toLowerCase()
                        );

                      return (
                        <button
                          key={`${product._id}-${color.name}`}
                          type="button"
                          title={
                            color.name
                          }
                          aria-label={`Select ${color.name}`}
                          aria-pressed={
                            active
                          }
                          onClick={() =>
                            handleColorChange(
                              color
                            )
                          }
                          className={`
                                                        relative
                                                        h-10
                                                        w-10
                                                        rounded-full
                                                        border-2
                                                        transition-all
                                                        hover:scale-105
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-primary
                                                        focus:ring-offset-2
                                                        sm:h-11
                                                        sm:w-11
                                                        ${active
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-border"
                            }
                                                    `}
                          style={{
                            backgroundColor:
                              color.hex,
                          }}
                        >
                          {active && (
                            <Check
                              className="absolute inset-0 m-auto h-4 w-4"
                              style={{
                                color: isWhite
                                  ? "#000"
                                  : "#fff",
                              }}
                            />
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                            SIZE
                        ================================================== */}

            {sizes.length > 0 && (
              <div className="mb-6 sm:mb-7">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold">
                      Size
                    </span>

                    {selectedSize !==
                      null && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          EU{" "}
                          {
                            selectedSize
                          }
                        </span>
                      )}
                  </div>

                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    EU sizing
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map(
                    (size) => {
                      const active =
                        selectedSize ===
                        size;

                      return (
                        <button
                          key={`${product._id}-${size}`}
                          type="button"
                          onClick={() =>
                            setSelectedSize(
                              size
                            )
                          }
                          aria-label={`Select size ${size}`}
                          aria-pressed={
                            active
                          }
                          className={`
                                                        min-w-[52px]
                                                        rounded-lg
                                                        border
                                                        px-3
                                                        py-2.5
                                                        text-sm
                                                        font-medium
                                                        transition
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-primary
                                                        focus:ring-offset-2
                                                        ${active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary hover:bg-muted"
                            }
                                                    `}
                        >
                          {size}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                            QUANTITY
                        ================================================== */}

            <div className="mb-6 sm:mb-7">
              <span className="mb-3 block text-sm font-semibold">
                Quantity
              </span>

              <div className="flex h-11 w-fit items-center overflow-hidden rounded-lg border">
                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <=
                    1
                  }
                  aria-label="Decrease quantity"
                  className="
                                        flex
                                        h-full
                                        w-11
                                        items-center
                                        justify-center
                                        transition
                                        hover:bg-muted
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="
                                    flex
                                    h-full
                                    w-12
                                    items-center
                                    justify-center
                                    border-x
                                    text-sm
                                    font-semibold
                                ">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    quantity >=
                    maxQuantity
                  }
                  aria-label="Increase quantity"
                  className="
                                        flex
                                        h-full
                                        w-11
                                        items-center
                                        justify-center
                                        transition
                                        hover:bg-muted
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {!isOutOfStock && (
                <p className="mt-2 text-[10px] text-muted-foreground">
                  {product.quantity}{" "}
                  available
                </p>
              )}
            </div>

            {/* =================================================
                            ADD TO CART
                        ================================================== */}

            <Button
              type="button"
              size="lg"
              disabled={
                isOutOfStock ||
                isAdding ||
                (sizes.length >
                  0 &&
                  selectedSize ===
                  null) ||
                (colors.length >
                  0 &&
                  !selectedColor)
              }
              onClick={
                handleAddToCart
              }
              className="
                                h-13
                                w-full
                                rounded-xl
                                text-sm
                                font-semibold
                                sm:h-14
                                sm:text-base
                            "
            >
              <ShoppingBag className="mr-2 h-4 w-4" />

              {isAdding
                ? "Adding..."
                : isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
            </Button>

            {/* =================================================
                            SERVICE FEATURES
                        ================================================== */}

            <div className="
                            mt-5
                            grid
                            grid-cols-1
                            divide-y
                            rounded-xl
                            border
                            sm:grid-cols-3
                            sm:divide-x
                            sm:divide-y-0
                        ">
              <div className="flex items-center gap-3 p-3 sm:flex-col sm:items-start sm:p-4">
                <Truck className="h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium">
                    Delivery
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Available at checkout
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:flex-col sm:items-start sm:p-4">
                <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium">
                    Quality
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Premium product
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:flex-col sm:items-start sm:p-4">
                <ShoppingBag className="h-4 w-4 shrink-0 text-muted-foreground" />

                <div>
                  <p className="text-xs font-medium">
                    Secure order
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Easy checkout
                  </p>
                </div>
              </div>
            </div>

            {/* Product facts */}

            <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-xl bg-muted/50 p-3 sm:p-4">
                <p className="text-[10px] text-muted-foreground">
                  Brand
                </p>

                <p className="mt-1 truncate text-xs font-semibold sm:text-sm">
                  {product.brand}
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-3 sm:p-4">
                <p className="text-[10px] text-muted-foreground">
                  Gender
                </p>

                <p className="mt-1 text-xs font-semibold sm:text-sm">
                  {product.gender}
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-3 sm:p-4">
                <p className="text-[10px] text-muted-foreground">
                  Colors
                </p>

                <p className="mt-1 text-xs font-semibold sm:text-sm">
                  {colors.length}
                </p>
              </div>

              <div className="rounded-xl bg-muted/50 p-3 sm:p-4">
                <p className="text-[10px] text-muted-foreground">
                  Sizes
                </p>

                <p className="mt-1 text-xs font-semibold sm:text-sm">
                  {sizes.length}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* =================================================
                    INFORMATION TABS
                ================================================== */}

        <section className="mt-4 border-t pt-10 sm:mt-20 sm:pt-12">
          <Tabs defaultValue="details" className="w-full">
            {/* =========================================================
        TAB NAVIGATION
    ========================================================= */}
            <div className="relative">
              <TabsList
                className="
    flex
    h-auto
    w-full
    flex-wrap
    gap-2
    rounded-none
    bg-transparent
    p-0
  "
              >
                <TabsTrigger
                  value="details"
                  className="
      rounded-full
      border
      bg-background
      px-5
      py-3.5
      cursor-pointer
      text-sm
      font-medium
      text-muted-foreground
      shadow-sm
      transition-all
      duration-200
      hover:border-primary/30
      hover:text-foreground
      data-[state=active]:border-primary
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
                >
                  Details
                </TabsTrigger>

                <TabsTrigger
                  value="sizing"
                  className="
      rounded-full
      border
      bg-background
      px-5
      py-3.5
      cursor-pointer
      text-sm
      font-medium
      text-muted-foreground
      shadow-sm
      transition-all
      duration-200
      hover:border-primary/30
      hover:text-foreground
      data-[state=active]:border-primary
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
                >
                  Size Guide
                </TabsTrigger>

                <TabsTrigger
                  value="shipping"
                  className="
      rounded-full
      border
      bg-background
      px-5
      py-3.5
      cursor-pointer
      text-sm
      font-medium
      text-muted-foreground
      shadow-sm
      transition-all
      duration-200
      hover:border-primary/30
      hover:text-foreground
      data-[state=active]:border-primary
      data-[state=active]:bg-primary
      data-[state=active]:text-primary-foreground
      data-[state=active]:shadow-md
    "
                >
                  Shipping & Returns
                </TabsTrigger>
              </TabsList>
            </div>

            {/* =========================================================
        DETAILS
    ========================================================= */}
            <TabsContent
              value="details"
              className="mt-0 pt-8 outline-none sm:pt-10 px-4"
            >
              <div className="max-w-4xl">
                <div className="mb-7">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Product information
                  </p>

                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    About this product
                  </h2>
                </div>

                <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-[15px]">
                  {product.description}
                </p>

                {/* Product attributes */}
                <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
                  <div
                    className="
              rounded-2xl
              border
              bg-card/60
              p-5
              transition-all
              duration-200
              hover:border-primary/20
              hover:bg-card
            "
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Category
                    </p>

                    <p className="mt-2 text-sm font-semibold capitalize">
                      {product.categorySlug}
                    </p>
                  </div>

                  <div
                    className="
              rounded-2xl
              border
              bg-card/60
              p-5
              transition-all
              duration-200
              hover:border-primary/20
              hover:bg-card
            "
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Designed for
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {product.gender}
                    </p>
                  </div>

                  <div
                    className="
              rounded-2xl
              border
              bg-card/60
              p-5
              transition-all
              duration-200
              hover:border-primary/20
              hover:bg-card
            "
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Brand
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      {product.brand}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* =========================================================
        SIZE GUIDE
    ========================================================= */}
            <TabsContent
              value="sizing"
              className="mt-0 pt-8 outline-none sm:pt-10"
            >
              <div className="max-w-4xl">
                <div className="mb-7">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Fit & sizing
                  </p>

                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Available sizes
                  </h2>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[15px]">
                  This product uses EU sizing. Select an available
                  size above before adding the item to your cart.
                </p>

                {sizes.length > 0 ? (
                  <div className="mt-7 flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <div
                        key={size}
                        className="
                  flex
                  h-12
                  min-w-[64px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  bg-card
                  px-4
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  hover:border-primary/40
                  hover:bg-muted/40
                "
                      >
                        EU {size}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="
              mt-7
              rounded-2xl
              border
              bg-muted/30
              px-5
              py-6
            "
                  >
                    <p className="text-sm text-muted-foreground">
                      Size information is not available for this product.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* =========================================================
        SHIPPING & RETURNS
    ========================================================= */}
            <TabsContent
              value="shipping"
              className="mt-0 pt-8 outline-none sm:pt-10"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:max-w-5xl">
                {/* Delivery */}
                <div
                  className="
            group
            rounded-2xl
            border
            bg-card/60
            p-6
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-primary/20
            hover:bg-card
            hover:shadow-sm
            sm:p-7
          "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-muted
                transition-colors
                group-hover:bg-primary/10
              "
                    >
                      <Truck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Delivery
                      </p>

                      <h3 className="mt-0.5 text-base font-semibold">
                        Fast & convenient
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    Delivery options and charges are calculated during
                    checkout based on your delivery location.
                  </p>
                </div>

                {/* Returns */}
                <div
                  className="
            group
            rounded-2xl
            border
            bg-card/60
            p-6
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-primary/20
            hover:bg-card
            hover:shadow-sm
            sm:p-7
          "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-muted
                transition-colors
                group-hover:bg-primary/10
              "
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Returns
                      </p>

                      <h3 className="mt-0.5 text-base font-semibold">
                        Shop with confidence
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    Please review your store&apos;s return policy before
                    completing your purchase.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
