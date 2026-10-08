"use client";

import { useMemo, useState } from "react";
import {
    Check,
    ChevronDown,
    ChevronUp,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import CategoryFilter from "./CategoryFilter";

export interface FilterState {
    categories: string[];
    brands: string[];
    colors: string[];
    sizes: number[];
    genders: ("Men" | "Women" | "Unisex")[];
    minPrice?: number;
    maxPrice?: number;
}

interface FilterProduct {
    brand: string;

    colors: {
        name: string;
        hex: string;
    }[];

    sizes: number[];

    gender: "Men" | "Women" | "Unisex";

    price: number;
}

interface SidebarFiltersProps {
    products: FilterProduct[];
    filters: FilterState;
    onFilterChange: (
        filters: FilterState
    ) => void;
}

export default function SidebarFilters({
    products,
    filters,
    onFilterChange,
}: SidebarFiltersProps) {
    const [showMobileFilters, setShowMobileFilters] =
        useState(false);

    const brands = useMemo(() => {
        return Array.from(
            new Set(products.map((product) => product.brand))
        ).sort();
    }, [products]);

    const colors = useMemo(() => {
        const map = new Map<string, string>();

        products.forEach((product) => {
            product.colors.forEach((color) => {
                map.set(color.name, color.hex);
            });
        });

        return Array.from(map.entries())
            .map(([name, hex]) => ({
                name,
                hex,
            }))
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );
    }, [products]);

    const sizes = useMemo(() => {
        return Array.from(
            new Set(
                products.flatMap(
                    (product) => product.sizes
                )
            )
        ).sort((a, b) => a - b);
    }, [products]);

    const activeFiltersCount =
        filters.categories.length +
        filters.brands.length +
        filters.colors.length +
        filters.sizes.length +
        filters.genders.length +
        (filters.minPrice !== undefined ? 1 : 0) +
        (filters.maxPrice !== undefined ? 1 : 0);

    function toggleStringFilter(
        type:
            | "categories"
            | "brands"
            | "colors"
            | "genders",
        value: string
    ) {
        const current = filters[type];

        const updated = current.includes(
            value as never
        )
            ? current.filter(
                (item) => item !== value
            )
            : [...current, value as never];

        onFilterChange({
            ...filters,
            [type]: updated,
        });
    }

    function toggleSize(size: number) {
        const updated = filters.sizes.includes(size)
            ? filters.sizes.filter(
                (item) => item !== size
            )
            : [...filters.sizes, size];

        onFilterChange({
            ...filters,
            sizes: updated,
        });
    }

    function clearFilters() {
        onFilterChange({
            categories: [],
            brands: [],
            colors: [],
            sizes: [],
            genders: [],
            minPrice: undefined,
            maxPrice: undefined,
        });
    }

    function FilterSection({
        title,
        children,
        defaultOpen = true,
    }: {
        title: string;
        children: React.ReactNode;
        defaultOpen?: boolean;
    }) {
        const [open, setOpen] =
            useState(defaultOpen);

        return (
            <div>
                <div className="flex items-center justify-between py-3">
                    <h3 className="text-sm font-medium">
                        {title}
                    </h3>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                            setOpen((value) => !value)
                        }
                    >
                        {open ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {open && (
                    <div className="pb-4">
                        {children}
                    </div>
                )}

                <Separator />
            </div>
        );
    }

    function FilterContent() {
        return (
            <div>
                {/* Categories */}
                <FilterSection title="Categories">
                    <CategoryFilter
                        selectedCategories={
                            filters.categories
                        }
                        onCategoryChange={(slug) =>
                            toggleStringFilter(
                                "categories",
                                slug
                            )
                        }
                    />
                </FilterSection>

                {/* Brands */}
                <FilterSection title="Brands">
                    {brands.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No brands available.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {brands.map((brand) => {
                                const id = `brand-${brand}`;

                                return (
                                    <div
                                        key={brand}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={id}
                                            checked={filters.brands.includes(
                                                brand
                                            )}
                                            onCheckedChange={() =>
                                                toggleStringFilter(
                                                    "brands",
                                                    brand
                                                )
                                            }
                                        />

                                        <label
                                            htmlFor={id}
                                            className="cursor-pointer text-sm"
                                        >
                                            {brand}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </FilterSection>

                {/* Colors */}
                <FilterSection title="Colors">
                    {colors.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No colors available.
                        </p>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((color) => {
                                const selected =
                                    filters.colors.includes(
                                        color.name
                                    );

                                return (
                                    <div
                                        key={color.name}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <button
                                            type="button"
                                            title={color.name}
                                            aria-label={`Filter by ${color.name}`}
                                            className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full border",
                                                selected &&
                                                "ring-2 ring-primary ring-offset-2"
                                            )}
                                            style={{
                                                backgroundColor:
                                                    color.hex,
                                            }}
                                            onClick={() =>
                                                toggleStringFilter(
                                                    "colors",
                                                    color.name
                                                )
                                            }
                                        >
                                            {selected && (
                                                <Check className="h-4 w-4 text-white drop-shadow" />
                                            )}
                                        </button>

                                        <span className="max-w-full truncate text-xs">
                                            {color.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </FilterSection>

                {/* Sizes */}
                <FilterSection title="Sizes">
                    {sizes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No sizes available.
                        </p>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map((size) => (
                                <Button
                                    key={size}
                                    type="button"
                                    variant={
                                        filters.sizes.includes(size)
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    className="h-8"
                                    onClick={() =>
                                        toggleSize(size)
                                    }
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    )}
                </FilterSection>

                {/* Gender */}
                <FilterSection title="Gender">
                    <div className="space-y-2">
                        {(
                            [
                                "Men",
                                "Women",
                                "Unisex",
                            ] as const
                        ).map((gender) => {
                            const id = `gender-${gender}`;

                            return (
                                <div
                                    key={gender}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={id}
                                        checked={filters.genders.includes(
                                            gender
                                        )}
                                        onCheckedChange={() =>
                                            toggleStringFilter(
                                                "genders",
                                                gender
                                            )
                                        }
                                    />

                                    <label
                                        htmlFor={id}
                                        className="cursor-pointer text-sm"
                                    >
                                        {gender}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </FilterSection>

                {/* Price */}
                <FilterSection title="Price">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            min="0"
                            placeholder="Min"
                            value={
                                filters.minPrice ?? ""
                            }
                            onChange={(event) => {
                                const value =
                                    event.target.value;

                                onFilterChange({
                                    ...filters,
                                    minPrice:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                });
                            }}
                            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />

                        <input
                            type="number"
                            min="0"
                            placeholder="Max"
                            value={
                                filters.maxPrice ?? ""
                            }
                            onChange={(event) => {
                                const value =
                                    event.target.value;

                                onFilterChange({
                                    ...filters,
                                    maxPrice:
                                        value === ""
                                            ? undefined
                                            : Number(value),
                                });
                            }}
                            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </FilterSection>
            </div>
        );
    }

    return (
        <>
            {/* Mobile */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        setShowMobileFilters(true)
                    }
                >
                    Filters

                    {activeFiltersCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-2"
                        >
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>

                {activeFiltersCount > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                    >
                        Clear all
                    </Button>
                )}
            </div>

            {/* Mobile drawer */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        className="absolute inset-0 bg-black/40"
                        onClick={() =>
                            setShowMobileFilters(false)
                        }
                    />

                    <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-background shadow-xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold">
                                Filters
                            </h2>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setShowMobileFilters(false)
                                }
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4">
                                <FilterContent />
                            </div>
                        </ScrollArea>

                        <div className="flex items-center justify-between border-t p-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Clear all
                            </Button>

                            <Button
                                type="button"
                                onClick={() =>
                                    setShowMobileFilters(false)
                                }
                            >
                                Apply filters
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop */}
            <aside className="hidden w-64 shrink-0 lg:block">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Filters
                    </h2>

                    {activeFiltersCount > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear all
                        </Button>
                    )}
                </div>

                <FilterContent />
            </aside>
        </>
    );
}
