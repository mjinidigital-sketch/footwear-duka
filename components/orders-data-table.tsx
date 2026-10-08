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
  ClockIcon,
  PackageIcon,
  TruckIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CopyIcon,
  RefreshCwIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
} from "lucide-react";
import { updateOrderStatus, deleteOrder, createOrderAdmin, getOrdersAdmin } from "@/app/actions";

// Order Schema
export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number(),
  color: z.string(),
  size: z.number(),
  price: z.number(),
});

export const orderSchema = z.object({
  _id: z.string(),
  userId: z.string().optional(),
  sessionId: z.string(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  totalAmount: z.number(),
  shippingAmount: z.number(),
  items: z.array(orderItemSchema),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;

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

const columnHelper = createColumnHelper<typeof features, Order>();

export function OrdersDataTable({ data: initialData }: { data: Order[] }) {
  const [data, setData] = React.useState<Order[]>(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Selected Order for Modal View
  const [viewingOrder, setViewingOrder] = React.useState<Order | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // New order form state
  const [newCustomerName, setNewCustomerName] = React.useState("");
  const [newCustomerPhone, setNewCustomerPhone] = React.useState("");
  const [newAddress, setNewAddress] = React.useState("");
  const [newCity, setNewCity] = React.useState("");
  const [newPostalCode, setNewPostalCode] = React.useState("");
  const [newItemName, setNewItemName] = React.useState("");
  const [newItemColor, setNewItemColor] = React.useState("Black");
  const [newItemSize, setNewItemSize] = React.useState("42");
  const [newItemPrice, setNewItemPrice] = React.useState("5500");
  const [newItemQty, setNewItemQty] = React.useState("1");
  const [newShippingCost, setNewShippingCost] = React.useState("300");
  const [newNotes, setNewNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refreshData = async () => {
    try {
      const refreshed = await getOrdersAdmin();
      setData(
        (refreshed || []).map((o: any) => ({
          _id: o._id,
          userId: o.userId,
          sessionId: o.sessionId,
          status: o.status,
          totalAmount: o.totalAmount,
          shippingAmount: o.shippingAmount,
          items: o.items || [],
          shippingAddress: o.shippingAddress,
          paymentId: o.paymentId,
          notes: o.notes,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        }))
      );
      toast.success("Orders refreshed");
    } catch {
      toast.error("Failed to refresh orders");
    }
  };

  // Filtered dataset
  const filteredData = React.useMemo(() => {
    return data.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Search query across ID, customer name, phone, address, notes
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order._id.toLowerCase().includes(query);
        const matchesName = order.shippingAddress.fullName.toLowerCase().includes(query);
        const matchesPhone = order.shippingAddress.phone.toLowerCase().includes(query);
        const matchesCity = order.shippingAddress.city.toLowerCase().includes(query);
        const matchesNotes = order.notes?.toLowerCase().includes(query);
        const matchesItems = order.items.some((i) => i.name.toLowerCase().includes(query));
        return matchesId || matchesName || matchesPhone || matchesCity || matchesNotes || matchesItems;
      }

      return true;
    });
  }, [data, searchQuery, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        setData((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus, updatedAt: Date.now() } : o))
        );
        if (viewingOrder && viewingOrder._id === orderId) {
          setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to permanently delete this order?")) return;
    try {
      const res = await deleteOrder(orderId);
      if (res.success) {
        toast.success("Order deleted successfully");
        setData((prev) => prev.filter((o) => o._id !== orderId));
        if (viewingOrder?._id === orderId) {
          setViewingOrder(null);
        }
      } else {
        toast.error(res.error || "Failed to delete order");
      }
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone || !newAddress || !newItemName) {
      toast.error("Please fill in required customer and product details");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemPrice = Number(newItemPrice) || 0;
      const itemQty = Number(newItemQty) || 1;
      const shippingAmount = Number(newShippingCost) || 0;
      const totalAmount = itemPrice * itemQty + shippingAmount;

      const orderData = {
        sessionId: `manual_${Date.now()}`,
        status: "pending" as const,
        totalAmount,
        shippingAmount,
        items: [
          {
            productId: "manual_entry" as any,
            name: newItemName,
            quantity: itemQty,
            color: newItemColor,
            size: Number(newItemSize) || 42,
            price: itemPrice,
          },
        ],
        shippingAddress: {
          fullName: newCustomerName,
          phone: newCustomerPhone,
          address: newAddress,
          city: newCity || "Nairobi",
          postalCode: newPostalCode || "00100",
        },
        notes: newNotes || undefined,
      };

      const res = await createOrderAdmin(orderData);
      if (res.success) {
        toast.success("Order created successfully");
        setIsCreateOpen(false);
        // Reset form
        setNewCustomerName("");
        setNewCustomerPhone("");
        setNewAddress("");
        setNewCity("");
        setNewPostalCode("");
        setNewItemName("");
        setNewNotes("");
        await refreshData();
      } else {
        toast.error(res.error || "Failed to create order");
      }
    } catch {
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700">
            <ClockIcon className="h-3 w-3 text-amber-600" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="gap-1 border-blue-300 bg-blue-50 text-blue-700">
            <PackageIcon className="h-3 w-3 text-blue-600" />
            Processing
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="gap-1 border-purple-300 bg-purple-50 text-purple-700">
            <TruckIcon className="h-3 w-3 text-purple-600" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700">
            <CheckCircle2Icon className="h-3 w-3 text-emerald-600" />
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="gap-1 border-rose-300 bg-rose-50 text-rose-700">
            <XCircleIcon className="h-3 w-3 text-rose-600" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

        columnHelper.accessor("_id", {
          header: "Order ID",
          cell: ({ getValue }) => {
            const id = getValue();
            return (
              <div className="flex items-center gap-1 font-mono text-xs font-semibold">
                <span>#{id.slice(-8).toUpperCase()}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(id);
                    toast.success("Order ID copied");
                  }}
                >
                  <CopyIcon className="h-3 w-3" />
                </Button>
              </div>
            );
          },
        }),

        columnHelper.accessor((row) => row.shippingAddress.fullName, {
          id: "customer",
          header: "Customer",
          cell: ({ row }) => (
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{row.original.shippingAddress.fullName}</span>
              <span className="text-xs text-muted-foreground">{row.original.shippingAddress.phone}</span>
              <span className="text-xs text-muted-foreground">{row.original.shippingAddress.city}</span>
            </div>
          ),
        }),

        columnHelper.accessor((row) => row.items.length, {
          id: "items",
          header: "Items",
          cell: ({ row }) => {
            const count = row.original.items.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <div className="flex flex-col">
                <span className="font-medium">{count} item{count !== 1 ? "s" : ""}</span>
                <span className="truncate text-xs text-muted-foreground max-w-[140px]">
                  {row.original.items.map((i) => i.name).join(", ")}
                </span>
              </div>
            );
          },
        }),

        columnHelper.accessor("totalAmount", {
          header: "Total (KES)",
          cell: ({ getValue }) => (
            <span className="font-semibold text-foreground">
              KES {getValue().toLocaleString()}
            </span>
          ),
        }),

        columnHelper.accessor("status", {
          header: "Status",
          cell: ({ row, getValue }) => {
            const status = getValue();
            return (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button className="cursor-pointer hover:opacity-80 transition-opacity">
                      {getStatusBadge(status)}
                    </button>
                  }
                />
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "processing")}>
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "shipped")}>
                    Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "delivered")}>
                    Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusUpdate(row.original._id, "cancelled")}
                    className="text-destructive"
                  >
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        }),

        columnHelper.accessor("createdAt", {
          header: "Date",
          cell: ({ getValue }) => {
            const val = getValue();
            if (!val) return <span className="text-muted-foreground text-xs">N/A</span>;
            const date = new Date(val);
            return (
              <div className="flex flex-col text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{date.toLocaleDateString()}</span>
                <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            );
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setViewingOrder(row.original)}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Change Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "pending")}>
                    Mark Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "processing")}>
                    Mark Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "shipped")}>
                    Mark Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "delivered")}>
                    Mark Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "cancelled")}>
                    Mark Cancelled
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(row.original._id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
      ]),
    [viewingOrder]
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
      {/* Search and Filters Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Search by ID, customer, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
            Create Order
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
                    <PackageIcon className="h-8 w-8 text-muted-foreground/50" />
                    <span>No orders matching your criteria.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="orders-page-size" className="text-sm">Rows per page</Label>
            <Select
              value={`${table.state.pagination.pageSize}`}
              onValueChange={(val) => table.setPageSize(Number(val))}
            >
              <SelectTrigger size="sm" className="w-18" id="orders-page-size">
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

      {/* VIEW ORDER DETAILS DIALOG */}
      <Dialog open={!!viewingOrder} onOpenChange={(open: boolean) => !open && setViewingOrder(null)}>
        {viewingOrder && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between pr-4">
                <div>
                  <DialogTitle className="text-xl">
                    Order #{viewingOrder._id.slice(-8).toUpperCase()}
                  </DialogTitle>
                  <DialogDescription>
                    Placed on {viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleString() : "N/A"}
                  </DialogDescription>
                </div>
                {getStatusBadge(viewingOrder.status)}
              </div>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Quick Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-muted/60 border">
                <span className="text-sm font-medium">Update Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(["pending", "processing", "shipped", "delivered", "cancelled"] as Order["status"][]).map(
                    (st) => (
                      <Button
                        key={st}
                        size="sm"
                        variant={viewingOrder.status === st ? "default" : "outline"}
                        className="capitalize h-7 text-xs"
                        onClick={() => handleStatusUpdate(viewingOrder._id, st)}
                      >
                        {st}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <UserIcon className="h-4 w-4 text-primary" />
                    Customer Info
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><span className="font-medium text-foreground">Name:</span> {viewingOrder.shippingAddress.fullName}</p>
                    <p><span className="font-medium text-foreground">Phone:</span> {viewingOrder.shippingAddress.phone}</p>
                    {viewingOrder.userId && (
                      <p className="font-mono text-xs"><span className="font-medium text-foreground">User ID:</span> {viewingOrder.userId}</p>
                    )}
                    <p className="font-mono text-xs"><span className="font-medium text-foreground">Session ID:</span> {viewingOrder.sessionId}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <MapPinIcon className="h-4 w-4 text-primary" />
                    Delivery Address
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><span className="font-medium text-foreground">Address:</span> {viewingOrder.shippingAddress.address}</p>
                    <p><span className="font-medium text-foreground">City:</span> {viewingOrder.shippingAddress.city}</p>
                    <p><span className="font-medium text-foreground">Postal Code:</span> {viewingOrder.shippingAddress.postalCode}</p>
                    {viewingOrder.paymentId && (
                      <div className="pt-1 flex items-center gap-1 font-mono text-xs text-primary">
                        <CreditCardIcon className="h-3 w-3" />
                        <span>Payment Ref: #{viewingOrder.paymentId.slice(-8).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Ordered Items ({viewingOrder.items.length})</h4>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Color / Size</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingOrder.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.color} • Size {item.size}
                          </TableCell>
                          <TableCell className="text-center font-mono">{item.quantity}</TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            KES {item.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="rounded-lg bg-muted/30 p-4 border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Subtotal:</span>
                  <span>KES {(viewingOrder.totalAmount - viewingOrder.shippingAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee:</span>
                  <span>
                    {viewingOrder.shippingAmount === 0 ? "Free" : `KES ${viewingOrder.shippingAmount.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t text-foreground">
                  <span>Grand Total:</span>
                  <span className="text-primary font-mono">KES {viewingOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {viewingOrder.notes && (
                <div className="rounded-lg border p-3 bg-amber-50/50 border-amber-200 text-sm">
                  <span className="font-semibold text-amber-900 block mb-1">Customer / Admin Notes:</span>
                  <p className="text-amber-800">{viewingOrder.notes}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(viewingOrder._id)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Order
              </Button>
              <Button variant="outline" onClick={() => setViewingOrder(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* CREATE MANUAL ORDER DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateOrder}>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Manually record a walk-in, phone, or custom order in the system.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Customer Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="custName">Customer Full Name *</Label>
                    <Input
                      id="custName"
                      required
                      placeholder="Jane Doe"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="custPhone">Phone Number *</Label>
                    <Input
                      id="custPhone"
                      required
                      placeholder="0712345678"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="custAddress">Street / Building Address *</Label>
                    <Input
                      id="custAddress"
                      required
                      placeholder="Kenyatta Ave, Suite 4B"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="custCity">City</Label>
                    <Input
                      id="custCity"
                      placeholder="Nairobi"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-semibold text-sm">Product Item</h4>
                <div className="space-y-1">
                  <Label htmlFor="prodName">Shoe / Product Name *</Label>
                  <Input
                    id="prodName"
                    required
                    placeholder="AeroStride Marathoner v1"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="prodColor">Color</Label>
                    <Input
                      id="prodColor"
                      placeholder="Black"
                      value={newItemColor}
                      onChange={(e) => setNewItemColor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prodSize">Size (EU)</Label>
                    <Input
                      id="prodSize"
                      type="number"
                      placeholder="42"
                      value={newItemSize}
                      onChange={(e) => setNewItemSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prodPrice">Price (KES)</Label>
                    <Input
                      id="prodPrice"
                      type="number"
                      placeholder="5500"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="prodQty">Quantity</Label>
                    <Input
                      id="prodQty"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <Label htmlFor="shippingCost">Shipping Fee (KES)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={newShippingCost}
                    onChange={(e) => setNewShippingCost(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="00100"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="orderNotes">Order Notes</Label>
                <Input
                  id="orderNotes"
                  placeholder="Optional customer requests or payment method"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Save Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
