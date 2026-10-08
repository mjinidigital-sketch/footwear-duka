"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Checkbox } from "@/components/ui/checkbox";

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (slug: string) => void;
}

export default function CategoryFilter({
  selectedCategories,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = useQuery(
    api.products.getCategories
  );

  if (categories === undefined) {
    return (
      <div className="space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No categories available.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const id = `category-${category._id}`;

        return (
          <div
            key={category._id}
            className="flex items-center space-x-2"
          >
            <Checkbox
              id={id}
              checked={selectedCategories.includes(
                category.slug
              )}
              onCheckedChange={() =>
                onCategoryChange(category.slug)
              }
            />

            <label
              htmlFor={id}
              className="cursor-pointer text-sm leading-none"
            >
              {category.name}
            </label>
          </div>
        );
      })}
    </div>
  );
}
