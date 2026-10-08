"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { z } from "zod";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  EyeIcon,
  EyeOffIcon,
  EditIcon,
  RefreshCwIcon,
  TagIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  getCategoriesAdmin,
} from "@/app/actions";

// Category schema
export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type Category = z.infer<typeof categorySchema>;

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, Category>();

export function CategoriesDataTable({ data: initialData }: { data: Category[] }) {
  const [data, setData] = React.useState<Category[]>(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  // Form states (Create)
  const [newName, setNewName] = React.useState("");
  const [newSlug, setNewSlug] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newImage, setNewImage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states (Edit)
  const [editName, setEditName] = React.useState("");
  const [editSlug, setEditSlug] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");
  const [editImage, setEditImage] = React.useState("");
  const [editIsActive, setEditIsActive] = React.useState(true);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refreshData = async () => {
    try {
      const refreshed = await getCategoriesAdmin();
      setData(
        (refreshed || []).map((c: any) => ({
          _id: c._id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image: c.image,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          isActive: c.isActive ?? true,
        }))
      );
      toast.success("Categories refreshed");
    } catch {
      toast.error("Failed to refresh categories");
    }
  };

  const handleNameChangeForSlug = (val: string) => {
    setNewName(val);
    setNewSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSlug) {
      toast.error("Please provide both name and slug");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCategory({
        name: newName,
        slug: newSlug,
        description: newDescription || `${newName} collection`,
        image: newImage || undefined,
      });

      if (res.success) {
        toast.success("Category created successfully");
        setIsCreateOpen(false);
        setNewName("");
        setNewSlug("");
        setNewDescription("");
        setNewImage("");
        await refreshData();
      } else {
        toast.error(res.error || "Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || "");
    setEditImage(cat.image || "");
    setEditIsActive(cat.isActive ?? true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSubmitting(true);
    try {
      const updates = {
        name: editName,
        slug: editSlug,
        description: editDescription,
        image: editImage || undefined,
        isActive: editIsActive,
      };

      const res = await updateCategory(editingCategory._id, updates);
      if (res.success) {
        toast.success("Category updated successfully");
        setData((prev) =>
          prev.map((c) =>
            c._id === editingCategory._id ? { ...c, ...updates, updatedAt: Date.now() } : c
          )
        );
        setEditingCategory(null);
      } else {
        toast.error(res.error || "Failed to update category");
      }
    } catch {
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (categoryId: string) => {
    try {
      const res = await toggleCategoryActive(categoryId);
      if (res.success) {
        toast.success("Category status updated");
        setData((prev) =>
          prev.map((c) => (c._id === categoryId ? { ...c, isActive: !c.isActive } : c))
        );
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? Make sure no products are assigned to it.")) return;
    try {
      const res = await deleteCategory(categoryId);
      if (res.success) {
        toast.success("Category deleted");
        setData((prev) => prev.filter((c) => c._id !== categoryId));
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const filteredData = React.useMemo(() => {
    return data.filter((cat) => {
      if (statusFilter === "active" && !cat.isActive) return false;
      if (statusFilter === "inactive" && cat.isActive) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesSlug = cat.slug.toLowerCase().includes(query);
        const matchesDesc = cat.description.toLowerCase().includes(query);
        return matchesName || matchesSlug || matchesDesc;
      }
      return true;
    });
  }, [data, searchQuery, statusFilter]);

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
          header: "Category Name",
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              {row.original.image ? (
                <img
                  src={row.original.image}
                  alt={row.original.name}
                  className="h-9 w-9 rounded-md object-cover border"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground border">
                  <TagIcon className="h-4 w-4" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{row.original.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
              </div>
            </div>
          ),
        }),

        columnHelper.accessor("description", {
          header: "Description",
          cell: ({ getValue }) => (
            <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
              {getValue() || "No description"}
            </span>
          ),
        }),

        columnHelper.accessor("isActive", {
          header: "Status",
          cell: ({ getValue }) => {
            const isActive = getValue() ?? true;
            return isActive ? (
              <Badge variant="outline" className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700">
                <CheckCircle2Icon className="h-3 w-3 text-emerald-600" />
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 border-zinc-300 bg-zinc-50 text-zinc-600">
                <XCircleIcon className="h-3 w-3 text-zinc-400" />
                Inactive
              </Badge>
            );
          },
        }),

        columnHelper.accessor("createdAt", {
          header: "Created",
          cell: ({ getValue }) => {
            const val = getValue();
            if (!val) return <span className="text-xs text-muted-foreground">N/A</span>;
            return <span className="text-xs text-muted-foreground">{new Date(val).toLocaleDateString()}</span>;
          },
        }),

        columnHelper.display({
          id: "actions",
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => openEdit(row.original)}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit Category
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleActive(row.original._id)}>
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
                    onClick={() => handleDelete(row.original._id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
      ]),
    []
  );

  const table = useTable({
    features,
    data: filteredData,
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
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  <Columns3Icon className="mr-2 h-4 w-4" />
                  Columns
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(val) => column.toggleVisibility(!!val)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <TagIcon className="h-8 w-8 text-muted-foreground/50" />
                    <span>No categories found matching your criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="cat-page-size" className="text-sm">Rows per page</Label>
            <Select
              value={`${table.state.pagination.pageSize}`}
              onValueChange={(val) => table.setPageSize(Number(val))}
            >
              <SelectTrigger size="sm" className="w-18" id="cat-page-size">
                <SelectValue placeholder={table.state.pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm font-medium">
            Page {table.state.pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a category to group footwear products.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="catName">Category Name *</Label>
                <Input
                  id="catName"
                  required
                  placeholder="e.g. Hiking Boots"
                  value={newName}
                  onChange={(e) => handleNameChangeForSlug(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="catSlug">Slug *</Label>
                <Input
                  id="catSlug"
                  required
                  placeholder="e.g. hiking-boots"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="catDesc">Description</Label>
                <Textarea
                  id="catDesc"
                  placeholder="Short description of this category..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="catImg">Image URL (Optional)</Label>
                <Input
                  id="catImg"
                  placeholder="https://... or /images/..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT CATEGORY MODAL */}
      <Dialog open={!!editingCategory} onOpenChange={(open: boolean) => !open && setEditingCategory(null)}>
        {editingCategory && (
          <DialogContent className="max-w-md">
            <form onSubmit={handleEdit}>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update details for {editingCategory.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="editCatName">Category Name *</Label>
                  <Input
                    id="editCatName"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editCatSlug">Slug *</Label>
                  <Input
                    id="editCatSlug"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editCatDesc">Description</Label>
                  <Textarea
                    id="editCatDesc"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editCatImg">Image URL</Label>
                  <Input
                    id="editCatImg"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="editCatActive"
                    checked={editIsActive}
                    onCheckedChange={(val) => setEditIsActive(!!val)}
                  />
                  <Label htmlFor="editCatActive" className="cursor-pointer">
                    Category is Active (visible in store)
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
