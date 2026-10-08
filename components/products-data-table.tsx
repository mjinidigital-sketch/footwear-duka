"use client"

import * as React from "react"
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type SortingState,
} from "@tanstack/react-table"
import { z } from "zod"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  TrashIcon,
  StarIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"
import {
  toggleProductFeatured,
  toggleProductActive,
  deleteProduct,
  getProductsAdmin,
} from "@/app/actions"
import { AddProductForm } from "@/components/add-product-form"
import { EditProductForm } from "@/components/edit-product-form"

// Product schema matching Convex schema
export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  summary: z.string(),
  categoryId: z.string(),
  categorySlug: z.string(),
  brand: z.string(),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
      images: z.array(z.string()),
    })
  ),
  sizes: z.array(z.number()),
  gender: z.union([z.literal("Men"), z.literal("Women"), z.literal("Unisex")]),
  description: z.string(),
  mainImage: z.string(),
  gallery: z.array(z.string()),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export type Product = z.infer<typeof productSchema>

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Product>()

export function ProductsDataTable({
  data: initialData,
}: {
  data: Product[]
}) {
  const [data, setData] = React.useState<Product[]>(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const refreshData = React.useCallback(async () => {
    try {
      const products = await getProductsAdmin()
      setData(products as Product[])
    } catch {
      toast.error("Failed to refresh products")
    }
  }, [])

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("name", {
    header: "Product",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-3">
          <img
            src={product.mainImage}
            alt={product.name}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.brand}</div>
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor("categorySlug", {
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.categorySlug}
      </Badge>
    ),
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.gender}</Badge>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price
      return (
        <span className="font-medium">
          KES {price.toLocaleString()}
        </span>
      )
    },
  }),
  columnHelper.accessor("quantity", {
    header: "Stock",
    cell: ({ row }) => {
      const quantity = row.original.quantity
      const isLowStock = quantity < 10
      return (
        <Badge variant={isLowStock ? "destructive" : "default"}>
          {quantity}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("featured", {
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.original.featured
      return (
        <div className="flex items-center gap-2">
          {featured ? (
            <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          ) : (
            <StarIcon className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">{featured ? "Yes" : "No"}</span>
        </div>
      )
    },
  }),
  columnHelper.accessor("isActive", {
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive ?? true
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      if (!createdAt) return <span className="text-muted-foreground">N/A</span>
      const date = new Date(createdAt)
      return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <EditProductForm
          product={row.original}
          onSuccess={refreshData}
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-open:bg-muted"
                size="icon"
              />
            }
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={async () => {
                await toast.promise(
                  toggleProductFeatured(row.original._id),
                  {
                    loading: "Updating featured status...",
                    success: "Featured status updated",
                    error: "Failed to update featured status",
                  }
                )
                await refreshData()
              }}
            >
              {row.original.featured ? (
                <>
                  <StarIcon className="mr-2 h-4 w-4" />
                  Remove Featured
                </>
              ) : (
                <>
                  <StarIcon className="mr-2 h-4 w-4" />
                  Make Featured
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await toast.promise(
                  toggleProductActive(row.original._id),
                  {
                    loading: "Updating status...",
                    success: "Status updated",
                    error: "Failed to update status",
                  }
                )
                await refreshData()
              }}
            >
              {row.original.isActive ? (
                <>
                  <EyeOffIcon className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await toast.promise(
                  deleteProduct(row.original._id),
                  {
                    loading: "Deleting product...",
                    success: "Product deleted successfully",
                    error: "Failed to delete product",
                  }
                )
                await refreshData()
              }}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }),
]),
    [refreshData]
  )

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [genderFilter, setGenderFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [featuredFilter, setFeaturedFilter] = React.useState("all")
  const [dateSort, setDateSort] = React.useState("newest")

  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [searchQuery, categoryFilter, genderFilter, statusFilter, featuredFilter, dateSort])

  // Extract unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(data.map((p) => p.categorySlug))
    return Array.from(cats).sort()
  }, [data])

  // Filtered data
  const filteredData = React.useMemo(() => {
    return data.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || product.categorySlug === categoryFilter

      // Gender filter
      const matchesGender =
        genderFilter === "all" || product.gender === genderFilter

      // Status filter
      const isActive = product.isActive ?? true
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive)

      // Featured filter
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && product.featured) ||
        (featuredFilter === "not-featured" && !product.featured)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGender &&
        matchesStatus &&
        matchesFeatured
      )
    })
  }, [data, searchQuery, categoryFilter, genderFilter, statusFilter, featuredFilter])

  // Sort by date
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData]
    sorted.sort((a, b) => {
      const dateA = a.createdAt ?? 0
      const dateB = b.createdAt ?? 0
      return dateSort === "newest" ? dateB - dateA : dateA - dateB
    })
    return sorted
  }, [filteredData, dateSort])

  const table = useTable({
    features,
    data: sortedData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[200px]"
            />
            <Select
              value={categoryFilter}
              onValueChange={(val) => setCategoryFilter(val || "all")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={genderFilter}
              onValueChange={(val) => setGenderFilter(val || "all")}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Unisex">Unisex</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val || "all")}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={featuredFilter}
              onValueChange={(val) => setFeaturedFilter(val || "all")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="not-featured">Not Featured</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={dateSort}
              onValueChange={(val) => setDateSort(val || "newest")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <Columns3Icon className="mr-2 h-4 w-4" />
                Columns
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <AddProductForm onSuccess={refreshData} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <FlexRender header={header} />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {sortedData.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.state.pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
              items={[10, 20, 30, 40, 50].map((pageSize) => ({
                label: `${pageSize}`,
                value: `${pageSize}`,
              }))}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.state.pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.state.pagination.pageIndex + 1} of{" "}
            {Math.ceil(sortedData.length / table.state.pagination.pageSize) || 1}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={table.state.pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={table.state.pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={table.state.pagination.pageIndex >= Math.ceil(sortedData.length / table.state.pagination.pageSize) - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(Math.ceil(sortedData.length / table.state.pagination.pageSize) - 1)}
              disabled={table.state.pagination.pageIndex >= Math.ceil(sortedData.length / table.state.pagination.pageSize) - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
