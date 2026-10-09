"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  LogIn,
  UserPlus,
  X,
  Footprints,
  Sparkles,
  Flame,
  ShieldCheck,
  Percent,
  Truck,
  Phone,
  ArrowRight,
  Tag,
  PackageCheck,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import SidebarCart from "@/components/blocks/ecommerce/shopping-cart/sidebar-cart";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";

// Fallback categories for footwear store if query is loading or DB is empty
const DEFAULT_CATEGORIES = [
  {
    name: "Sneakers",
    slug: "sneakers",
    description: "Everyday streetwear kicks & lifestyle trainers",
    badge: "Popular",
    icon: Sparkles,
  },
  {
    name: "Running Shoes",
    slug: "running-shoes",
    description: "High-performance marathon & fitness runners",
    badge: "Hot",
    icon: Flame,
  },
  {
    name: "Boots",
    slug: "boots",
    description: "Rugged leather, outdoor & Chelsea boots",
    badge: "Durable",
    icon: ShieldCheck,
  },
  {
    name: "Sandals & Slides",
    slug: "sandals",
    description: "Comfortable casual slides & warm-weather wear",
    badge: "Chill",
    icon: Footprints,
  },
  {
    name: "Formal Shoes",
    slug: "formal-shoes",
    description: "Classic dress shoes, oxfords & sleek loafers",
    badge: "Classic",
    icon: Layers,
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Explore our complete curated footwear catalog",
    badge: "All",
    icon: ShoppingBag,
  },
];

// Helper to assign icons/badges to any category from Convex
function getCategoryMeta(slug: string) {
  const normalized = slug.toLowerCase();
  if (normalized.includes("sneaker")) {
    return { icon: Sparkles, badge: "Popular", hint: "Lifestyle & Streetwear" };
  }
  if (normalized.includes("run") || normalized.includes("sport") || normalized.includes("train")) {
    return { icon: Flame, badge: "Performance", hint: "Fitness & Marathons" };
  }
  if (normalized.includes("boot")) {
    return { icon: ShieldCheck, badge: "Rugged", hint: "Leather & Outdoors" };
  }
  if (normalized.includes("sandal") || normalized.includes("slide")) {
    return { icon: Footprints, badge: "Comfort", hint: "Slides & Casual" };
  }
  if (normalized.includes("formal") || normalized.includes("loafer") || normalized.includes("dress")) {
    return { icon: Layers, badge: "Classic", hint: "Office & Evening" };
  }
  return { icon: ShoppingBag, badge: "Footwear", hint: "Premium Selection" };
}

interface Navbar1Props {
  className?: string;
}

export default function Navbar1({ className }: Navbar1Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuthActions();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cart Context
  let cartCount = 0;
  try {
    const cartData = useCart();
    cartCount = cartData.summary?.totalItems || 0;
  } catch {
    if (typeof window !== "undefined") {
      const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
      cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    }
  }

  // Auth State from Convex
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.viewer, isAuthenticated ? {} : "skip");
  const canAccessDashboard = user?.role === "admin" || user?.role === "staff";

  // Categories from Convex
  const dbCategories = useQuery(api.products.getCategories);

  // Combine DB categories with rich metadata or fallback
  const categoriesList = (
    dbCategories && dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES
  ).map((cat) => {
    const meta = getCategoryMeta(cat.slug);
    return {
      _id: (cat as any)._id || cat.slug,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || meta.hint,
      badge: meta.badge,
      Icon: meta.icon,
    };
  });

  const handleLogout = async () => {
    const toastId = showLoadingToast("Signing you out...");
    try {
      await signOut();
      dismissToast(toastId);
      showSuccessToast("Signed out successfully.");
      router.push("/");
    } catch {
      dismissToast(toastId);
      showErrorToast("Failed to sign out. Please try again.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
    }
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCategoryMouseEnter = () => {
    if (categoryMenuTimeoutRef.current) {
      clearTimeout(categoryMenuTimeoutRef.current);
    }
    setIsCategoryMenuOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryMenuTimeoutRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 200);
  };

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          className
        )}
      >
        {/* =========================================================
            TOP ANNOUNCEMENT / UTILITY BAR
        ========================================================= */}
        <div className="bg-zinc-950 text-zinc-100 dark:bg-black border-b border-zinc-800 text-[11px] sm:text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
            {/* Left Perks / Promo */}
            <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Same-Day Delivery</span>
                <span className="sm:hidden">Fast Delivery</span>
              </span>
              <span className="text-zinc-600 hidden md:inline">•</span>
              <span className="hidden md:inline text-zinc-300">
                Free shipping on orders over <strong className="text-white">KES 5,000</strong>
              </span>
              <span className="text-zinc-600 hidden lg:inline">•</span>
              <span className="hidden lg:flex items-center gap-1 text-emerald-400 font-medium">
                <span>🇰🇪 Pay via M-Pesa</span>
              </span>
            </div>

            {/* Right Quick Links */}
            <div className="flex items-center gap-4 shrink-0 text-zinc-400">
              <Link
                href="/orders"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Track Order</span>
              </Link>
              <div className="w-px h-3 bg-zinc-800 hidden sm:block" />
              <span className="font-semibold text-zinc-300">KES (KSh)</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN NAVIGATION HEADER
        ========================================================= */}
        <div className="border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none"
              aria-label="Footwear Duka Homepage"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary via-orange-600 to-amber-500 p-0.5 shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                <div className="h-full w-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Footprints className="w-5 h-5 text-amber-400 group-hover:rotate-6 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight leading-none text-foreground flex items-center gap-1">
                  FOOTWEAR<span className="text-primary font-black">DUKA</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                  Nairobi • Footwear
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
              <Link
                href="/shop"
                className={cn(
                  "px-3.5 py-2 rounded-lg transition-colors hover:text-foreground hover:bg-muted/60",
                  pathname === "/shop" ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                All Shoes
              </Link>

              {/* CATEGORIES HOVER DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
                  className={cn(
                    "px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer",
                    isCategoryMenuOpen || pathname.includes("category")
                      ? "text-primary bg-muted/60 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                  aria-expanded={isCategoryMenuOpen}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200",
                      isCategoryMenuOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>

                {/* MEGA MENU DROPDOWN PANEL */}
                {isCategoryMenuOpen && (
                  <div
                    className="absolute top-full left-0 w-[580px] -translate-x-12 pt-2 animate-in fade-in-0 zoom-in-95 duration-200 z-50"
                    onMouseEnter={handleCategoryMouseEnter}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <div className="rounded-2xl border border-border bg-popover/98 p-5 shadow-2xl backdrop-blur-2xl ring-1 ring-foreground/5">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <Footprints className="w-4 h-4 text-primary" />
                          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Browse by Category
                          </span>
                        </div>
                        <Link
                          href="/shop"
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          View All
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {categoriesList.map((cat) => {
                          const IconComp = cat.Icon;
                          return (
                            <Link
                              key={cat.slug}
                              href={`/shop?category=${cat.slug}`}
                              onClick={() => setIsCategoryMenuOpen(false)}
                              className="group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-muted/80 border border-transparent hover:border-border/60"
                            >
                              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {cat.name}
                                  </span>
                                  {cat.badge && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary shrink-0">
                                      {cat.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                  {cat.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Footer banner in Mega Menu */}
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs bg-muted/40 rounded-xl p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Tag className="w-3.5 h-3.5 text-amber-500" />
                          <span>Looking for gender collections?</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href="/shop?gender=Men"
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            Men
                          </Link>
                          <span className="text-muted-foreground">•</span>
                          <Link
                            href="/shop?gender=Women"
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            Women
                          </Link>
                          <span className="text-muted-foreground">•</span>
                          <Link
                            href="/shop?gender=Unisex"
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            Unisex
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GENDER LINKS */}
              <Link
                href="/shop?gender=Men"
                className={cn(
                  "px-3.5 py-2 rounded-lg transition-colors hover:text-foreground hover:bg-muted/60",
                  pathname.includes("gender=Men") ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                Men
              </Link>
              <Link
                href="/shop?gender=Women"
                className={cn(
                  "px-3.5 py-2 rounded-lg transition-colors hover:text-foreground hover:bg-muted/60",
                  pathname.includes("gender=Women") ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                Women
              </Link>

            </nav>

            {/* RIGHT UTILITIES (Search, Wishlist, Account, Cart) */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* SEARCH BAR (Desktop) */}
              <div className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search sneakers, boots, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-48 lg:w-64 pl-9 pr-4 text-xs sm:text-sm rounded-full bg-muted/70 hover:bg-muted focus:bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </form>
              </div>

              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchExpanded((prev) => !prev)}
                className="md:hidden p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>


              {/* CART BUTTON */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center ring-2 ring-background shadow-xs animate-in zoom-in-75 duration-200">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* ACCOUNT / AUTH SECTION */}
              <div className="hidden sm:flex items-center">
                {isAuthLoading ? (
                  <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                ) : isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-3 h-3 text-muted-foreground opacity-70 hidden xl:block" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-56 z-[100] rounded-xl p-1.5 shadow-xl"
                      align="end"
                      sideOffset={8}
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {user.name || "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.role && (
                          <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <DropdownMenuSeparator />

                      {canAccessDashboard && (
                        <DropdownMenuItem
                          onClick={() => router.push("/admin")}
                          className="cursor-pointer font-medium"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => router.push("/orders")}
                        className="cursor-pointer"
                      >
                        <PackageCheck className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="text-xs font-semibold px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="h-9 px-4 rounded-full font-semibold text-xs shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* MOBILE HAMBURGER BUTTON */}
              <div className="lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger className="p-2 rounded-xl border border-border/80 hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-center">
                    <Menu className="w-5 h-5" />
                  </SheetTrigger>

                  <SheetContent
                    side="left"
                    className="w-full sm:max-w-md overflow-y-auto p-0 flex flex-col"
                  >
                    {/* Mobile Sheet Header */}
                    <SheetHeader className="p-5 border-b border-border/70 flex flex-row items-center justify-between text-left">
                      <SheetTitle >
                        <Link
                          href="/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5"
                        >
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-amber-500 p-0.5 flex items-center justify-center">
                            <div className="h-full w-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                              <Footprints className="w-4 h-4 text-amber-400" />
                            </div>
                          </div>
                          <div>
                            <span className="text-base font-black tracking-tight text-foreground">
                              FOOTWEAR<span className="text-primary">DUKA</span>
                            </span>
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                              Kenya Footwear Store
                            </p>
                          </div>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>

                    {/* Mobile Sheet Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">

                      {/* Mobile Search */}
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                          type="search"
                          placeholder="Search shoes, sneakers, boots..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-sm rounded-xl bg-muted border border-border focus:border-primary outline-none"
                        />
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </form>

                      {/* Quick Gender Tabs */}
                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          href="/shop?gender=Men"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-all"
                        >
                          Men&apos;s
                        </Link>
                        <Link
                          href="/shop?gender=Women"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-all"
                        >
                          Women&apos;s
                        </Link>
                        <Link
                          href="/shop?gender=Unisex"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-center py-2.5 px-3 rounded-xl border border-border bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-all"
                        >
                          Unisex
                        </Link>
                      </div>

                      {/* CATEGORIES ACCORDION / LIST */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Shop by Category
                          </p>
                          <Link
                            href="/shop"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            All Shoes →
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5">
                          {categoriesList.map((cat) => {
                            const IconComp = cat.Icon;
                            return (
                              <Link
                                key={cat.slug}
                                href={`/shop?category=${cat.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-muted/40 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {cat.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                                      {cat.description}
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Additional Links */}
                      <div className="pt-2 border-t border-border space-y-1">
                        <Link
                          href="/shop"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"
                        >
                          <span>Explore All Footwear</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted"
                        >
                          <span className="flex items-center gap-2">
                            <PackageCheck className="w-4 h-4 text-primary" />
                            Track My Order
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </div>

                      {/* Account Section in Mobile Sheet */}
                      <div className="pt-4 border-t border-border">
                        {isAuthenticated && user ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/60">
                              <Avatar className="h-10 w-10 ring-2 ring-primary">
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                  {getUserInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                {user.role && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                                    {user.role}
                                  </span>
                                )}
                              </div>
                            </div>

                            {canAccessDashboard && (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start rounded-xl"
                                onClick={() => {
                                  router.push("/admin");
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                                Admin Dashboard
                              </Button>
                            )}

                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start rounded-xl text-destructive hover:text-destructive"
                              onClick={handleLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Log Out
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Link
                              href="/signup"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full rounded-xl font-semibold h-11 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors text-sm shadow-sm"
                            >
                              Create an Account
                            </Link>
                            <Link
                              href="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="w-full rounded-xl font-semibold h-11 border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center transition-colors text-sm"
                            >
                              Sign In
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Store Assurance Badge in Mobile */}
                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                        <p className="font-semibold flex items-center gap-1.5">
                          <span>🇰🇪 Kenyan Owned & Operated</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Same-day delivery across Nairobi, Kisumu, Mombasa, Nakuru & Eldoret.
                        </p>
                      </div>

                    </div>
                  </SheetContent>
                </Sheet>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================
            MOBILE SEARCH EXPANDABLE BAR
        ========================================================= */}
        {isSearchExpanded && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md p-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="search"
                  autoFocus
                  placeholder="Search sneakers, boots, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-sm rounded-full bg-muted border border-border focus:border-primary outline-none"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <Button type="submit" size="sm" className="rounded-full px-4">
                Search
              </Button>
              <button
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                className="p-2 text-muted-foreground"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}