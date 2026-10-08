"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

import ProductCard, {
    ProductCardProduct,
} from "./ProductCard";

import SidebarFilters, {
    FilterState,
} from "./SidebarFilters";

export type InitialSearchParams = {
    [key: string]: string | string[] | undefined;
};

type ProductCatalogProps = {
    products: ProductCardProduct[];
    initialSearchParams?: InitialSearchParams;
};

const initialFiltersState: FilterState = {
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    genders: [],
    minPrice: undefined,
    maxPrice: undefined,
};

// Maps query terms like "sneakers", "boots", etc. to canonical category slugs
function mapQueryToCategory(query: string): string | null {
    const q = query.trim().toLowerCase();
    if (q === "sneaker" || q === "sneakers" || q.includes("sneaker")) return "sneakers";
    if (q === "running" || q === "running shoe" || q === "running shoes" || q === "runner" || q === "runners") return "running-shoes";
    if (q === "boot" || q === "boots" || q.includes("boot")) return "boots";
    if (q === "sandal" || q === "sandals" || q === "slide" || q === "slides") return "sandals";
    if (q === "formal" || q === "formal shoe" || q === "formal shoes" || q === "loafer" || q === "loafers" || q === "oxford" || q === "oxfords") return "formal-shoes";
    return null;
}

// Tokenized singular/plural insensitive search
function matchesSearchQuery(product: ProductCardProduct, query: string): boolean {
    if (!query || !query.trim()) return true;
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    const textCorpus = [
        product.name,
        product.brand,
        product.categorySlug,
        product.summary,
        product.description,
        product.gender,
    ].filter(Boolean).join(" ").toLowerCase();

    return tokens.every((token) => {
        const singular = token.endsWith("s") ? token.slice(0, -1) : token;
        const plural = token + "s";

        return (
            textCorpus.includes(token) ||
            textCorpus.includes(singular) ||
            textCorpus.includes(plural)
        );
    });
}

function parseParams(
    searchParams: URLSearchParams | null,
    initialParams?: InitialSearchParams
) {
    const getParam = (key: string): string => {
        if (searchParams?.has(key)) return searchParams.get(key) || "";
        const val = initialParams?.[key];
        return typeof val === "string" ? val : Array.isArray(val) ? val[0] || "" : "";
    };

    const getAllParams = (key: string): string[] => {
        if (searchParams && searchParams.getAll(key).length > 0) {
            return searchParams.getAll(key);
        }
        const val = initialParams?.[key];
        if (Array.isArray(val)) return val;
        if (typeof val === "string") return val.includes(",") ? val.split(",") : [val];
        return [];
    };

    const q = getParam("q") || getParam("search");
    let categories = getAllParams("category");
    if (categories.length === 0) categories = getAllParams("categories");

    // If q matches a known category and no category filter was given, auto-associate
    const categoryFromQuery = q ? mapQueryToCategory(q) : null;
    if (categories.length === 0 && categoryFromQuery) {
        categories = [categoryFromQuery];
    }

    let genders = getAllParams("gender");
    if (genders.length === 0) genders = getAllParams("genders");

    let brands = getAllParams("brand");
    if (brands.length === 0) brands = getAllParams("brands");

    const minPriceStr = getParam("minPrice");
    const maxPriceStr = getParam("maxPrice");

    return {
        q,
        categories,
        genders: genders as ("Men" | "Women" | "Unisex")[],
        brands,
        minPrice: minPriceStr ? Number(minPriceStr) : undefined,
        maxPrice: maxPriceStr ? Number(maxPriceStr) : undefined,
    };
}

function ProductCatalogInner({ products, initialSearchParams }: ProductCatalogProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Parse params from either client URL or server initial params
    const parsed = useMemo(() => {
        return parseParams(searchParams, initialSearchParams);
    }, [searchParams, initialSearchParams]);

    const [searchQuery, setSearchQuery] = useState(parsed.q);
    const [filters, setFilters] = useState<FilterState>({
        categories: parsed.categories,
        brands: parsed.brands,
        colors: [],
        sizes: [],
        genders: parsed.genders,
        minPrice: parsed.minPrice,
        maxPrice: parsed.maxPrice,
    });
    const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

    // Sync whenever URL changes
    useEffect(() => {
        const next = parseParams(searchParams, initialSearchParams);
        setSearchQuery(next.q);
        setFilters((prev) => ({
            ...prev,
            categories: next.categories,
            brands: next.brands,
            genders: next.genders,
            minPrice: next.minPrice,
            maxPrice: next.maxPrice,
        }));
    }, [searchParams, initialSearchParams]);

    // Updates browser URL cleanly without page reload
    const updateURL = (newFilters: FilterState, query: string) => {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        newFilters.categories.forEach((c) => params.append("category", c));
        newFilters.genders.forEach((g) => params.append("gender", g));
        newFilters.brands.forEach((b) => params.append("brand", b));
        if (newFilters.minPrice !== undefined) params.set("minPrice", String(newFilters.minPrice));
        if (newFilters.maxPrice !== undefined) params.set("maxPrice", String(newFilters.maxPrice));

        const str = params.toString();
        const nextUrl = str ? `/shop?${str}` : "/shop";
        if (typeof window !== "undefined") {
            window.history.replaceState(null, "", nextUrl);
        }
    };

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        updateURL(newFilters, searchQuery);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateURL(filters, searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        updateURL(filters, "");
    };

    const handleRemoveCategory = (cat: string) => {
        const next = {
            ...filters,
            categories: filters.categories.filter((c) => c !== cat),
        };
        setFilters(next);
        updateURL(next, searchQuery);
    };

    const handleRemoveGender = (gender: string) => {
        const next = {
            ...filters,
            genders: filters.genders.filter((g) => g !== gender),
        };
        setFilters(next);
        updateURL(next, searchQuery);
    };

    const handleRemoveBrand = (brand: string) => {
        const next = {
            ...filters,
            brands: filters.brands.filter((b) => b !== brand),
        };
        setFilters(next);
        updateURL(next, searchQuery);
    };

    const handleClearAll = () => {
        setSearchQuery("");
        setFilters(initialFiltersState);
        updateURL(initialFiltersState, "");
    };

    // Filter and Sort products
    const filteredProducts = useMemo(() => {
        const result = products.filter((product) => {
            // Search Query filter
            if (searchQuery.trim()) {
                if (!matchesSearchQuery(product, searchQuery)) {
                    return false;
                }
            }

            // Category filter
            if (
                filters.categories.length > 0 &&
                !filters.categories.includes(product.categorySlug)
            ) {
                return false;
            }

            // Brand filter
            if (
                filters.brands.length > 0 &&
                !filters.brands.includes(product.brand)
            ) {
                return false;
            }

            // Color filter
            if (filters.colors.length > 0) {
                const hasColor = product.colors.some((color) =>
                    filters.colors.includes(color.name)
                );
                if (!hasColor) return false;
            }

            // Size filter
            if (filters.sizes.length > 0) {
                const hasSize = product.sizes.some((size) =>
                    filters.sizes.includes(size)
                );
                if (!hasSize) return false;
            }

            // Gender filter
            if (filters.genders.length > 0) {
                const matchesGender = filters.genders.some(
                    (g) => product.gender === g || product.gender === "Unisex"
                );
                if (!matchesGender) return false;
            }

            // Price filters
            if (filters.minPrice !== undefined && product.price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
                return false;
            }

            return true;
        });

        // Sorting
        return result.sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });
    }, [products, filters, searchQuery, sortBy]);

    // Active heading
    const activeHeading = useMemo(() => {
        if (searchQuery.trim()) return `Results for "${searchQuery}"`;
        if (filters.categories.length === 1) {
            const cat = filters.categories[0];
            return cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
        }
        if (filters.genders.length === 1) {
            return `${filters.genders[0]}'s Footwear`;
        }
        return "All Footwear";
    }, [searchQuery, filters.categories, filters.genders]);

    const hasActiveFilters =
        Boolean(searchQuery.trim()) ||
        filters.categories.length > 0 ||
        filters.genders.length > 0 ||
        filters.brands.length > 0 ||
        filters.colors.length > 0 ||
        filters.sizes.length > 0 ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined;

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Toolbar / Header */}
            <div className="mb-6 flex flex-col gap-4 border-b border-border/70 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground capitalize">
                            {activeHeading}
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
                            {filteredProducts.length === 1 ? "pair" : "pairs"} found
                        </p>
                    </div>

                    {/* Inline Search Bar & Sort */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] flex-1 sm:flex-initial">
                            <input
                                type="search"
                                placeholder="Filter shoe name, brand..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full pl-9 pr-8 text-xs sm:text-sm rounded-full bg-muted/70 hover:bg-muted focus:bg-background border border-border focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                            />
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>

                        {/* Sort Selector */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="h-10 text-xs sm:text-sm rounded-full bg-muted/70 border border-border px-3.5 py-1.5 text-foreground outline-none cursor-pointer hover:bg-muted transition-colors font-medium"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ACTIVE FILTER PILLS */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in-0 duration-200">
                        <span className="text-xs font-semibold text-muted-foreground mr-1">
                            Active Filters:
                        </span>

                        {searchQuery.trim() && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                            >
                                <span>Search: &quot;{searchQuery}&quot;</span>
                                <X className="w-3 h-3" />
                            </button>
                        )}

                        {filters.categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => handleRemoveCategory(cat)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-destructive hover:text-destructive transition-colors capitalize"
                            >
                                <span>Category: {cat.replace("-", " ")}</span>
                                <X className="w-3 h-3" />
                            </button>
                        ))}

                        {filters.genders.map((g) => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => handleRemoveGender(g)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-destructive hover:text-destructive transition-colors"
                            >
                                <span>Gender: {g}</span>
                                <X className="w-3 h-3" />
                            </button>
                        ))}

                        {filters.brands.map((b) => (
                            <button
                                key={b}
                                type="button"
                                onClick={() => handleRemoveBrand(b)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-destructive hover:text-destructive transition-colors"
                            >
                                <span>Brand: {b}</span>
                                <X className="w-3 h-3" />
                            </button>
                        ))}

                        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleFilterChange({
                                        ...filters,
                                        minPrice: undefined,
                                        maxPrice: undefined,
                                    })
                                }
                                className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-destructive hover:text-destructive transition-colors"
                            >
                                <span>
                                    Price: KES {filters.minPrice?.toLocaleString() ?? "0"} -{" "}
                                    {filters.maxPrice?.toLocaleString() ?? "Any"}
                                </span>
                                <X className="w-3 h-3" />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs font-bold text-destructive hover:underline ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Layout: Sidebar Filters + Products Grid */}
            <div className="flex flex-col gap-8 lg:flex-row">
                <SidebarFilters
                    products={products}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                <main className="min-w-0 flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product as ProductCardProduct}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-border bg-muted/20 py-24 text-center px-4">
                            <div className="mx-auto w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl mb-4 shadow-xs">
                                👟
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                                No footwear found
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                                We couldn&apos;t find any pairs matching &ldquo;
                                <span className="font-semibold text-foreground">
                                    {searchQuery || filters.categories.join(", ") || "your filters"}
                                </span>
                                &rdquo;. Try checking another category or clearing your filters.
                            </p>
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                            >
                                View All Shoes
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function ProductCatalog(props: ProductCatalogProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen py-24 text-center flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">Loading catalog...</p>
            </div>
        }>
            <ProductCatalogInner {...props} />
        </Suspense>
    );
}
