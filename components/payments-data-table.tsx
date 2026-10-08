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
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  TrashIcon,
  EyeIcon,
  CopyIcon,
  RefreshCwIcon,
  CreditCardIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  PhoneIcon,
  EditIcon,
  FileTextIcon,
} from "lucide-react";
import {
  updatePaymentStatus,
  updatePaymentDetails,
  deletePayment,
  getPaymentsAdmin,
} from "@/app/actions";

// Payment Schema
export const paymentSchema = z.object({
  _id: z.string(),
  userId: z.string().optional(),
  orderId: z.string().optional(),
  sessionId: z.string(),
  amount: z.number(),
  phoneNumber: z.string(),
  mpesaReceiptNumber: z.string().optional(),
  transactionDate: z.string().optional(),
  checkoutRequestId: z.string().optional(),
  merchantRequestId: z.string().optional(),
  resultCode: z.string().optional(),
  resultDesc: z.string().optional(),
  status: z.enum(["pending", "completed", "failed", "cancelled"]),
  callbackReceived: z.boolean().optional(),
  callbackData: z.any().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});

export type Payment = z.infer<typeof paymentSchema>;

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

const columnHelper = createColumnHelper<typeof features, Payment>();

export function PaymentsDataTable({ data: initialData }: { data: Payment[] }) {
  const [data, setData] = React.useState<Payment[]>(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Selected Payment for Modal View
  const [viewingPayment, setViewingPayment] = React.useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);

  // Edit payment state
  const [editAmount, setEditAmount] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [editReceipt, setEditReceipt] = React.useState("");
  const [editStatus, setEditStatus] = React.useState<Payment["status"]>("completed");
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Sync when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refreshData = async () => {
    try {
      const refreshed = await getPaymentsAdmin();
      setData(
        (refreshed || []).map((p: any) => ({
          _id: p._id,
          userId: p.userId,
          orderId: p.orderId,
          sessionId: p.sessionId,
          amount: p.amount,
          phoneNumber: p.phoneNumber,
          mpesaReceiptNumber: p.mpesaReceiptNumber,
          transactionDate: p.transactionDate,
          checkoutRequestId: p.checkoutRequestId,
          merchantRequestId: p.merchantRequestId,
          resultCode: p.resultCode,
          resultDesc: p.resultDesc,
          status: p.status,
          callbackReceived: p.callbackReceived,
          callbackData: p.callbackData,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
      );
      toast.success("Payments refreshed");
    } catch {
      toast.error("Failed to refresh payments");
    }
  };

  // Filtered dataset
  const filteredData = React.useMemo(() => {
    return data.filter((payment) => {
      // Status filter
      if (statusFilter !== "all" && payment.status !== statusFilter) {
        return false;
      }

      // Search query across ID, phone, receipt number, merchant request, description
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = payment._id.toLowerCase().includes(query);
        const matchesPhone = payment.phoneNumber.toLowerCase().includes(query);
        const matchesReceipt = payment.mpesaReceiptNumber?.toLowerCase().includes(query);
        const matchesOrder = payment.orderId?.toLowerCase().includes(query);
        const matchesDesc = payment.resultDesc?.toLowerCase().includes(query);
        const matchesCheckout = payment.checkoutRequestId?.toLowerCase().includes(query);
        return matchesId || matchesPhone || matchesReceipt || matchesOrder || matchesDesc || matchesCheckout;
      }

      return true;
    });
  }, [data, searchQuery, statusFilter]);

  const handleStatusUpdate = async (paymentId: string, newStatus: Payment["status"]) => {
    try {
      const res = await updatePaymentStatus(paymentId, newStatus);
      if (res.success) {
        toast.success(`Payment marked as ${newStatus}`);
        setData((prev) =>
          prev.map((p) => (p._id === paymentId ? { ...p, status: newStatus, updatedAt: Date.now() } : p))
        );
        if (viewingPayment && viewingPayment._id === paymentId) {
          setViewingPayment((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm("Are you sure you want to permanently delete this payment transaction?")) return;
    try {
      const res = await deletePayment(paymentId);
      if (res.success) {
        toast.success("Payment deleted successfully");
        setData((prev) => prev.filter((p) => p._id !== paymentId));
        if (viewingPayment?._id === paymentId) {
          setViewingPayment(null);
        }
      } else {
        toast.error(res.error || "Failed to delete payment");
      }
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  const openEditModal = (payment: Payment) => {
    setEditingPayment(payment);
    setEditAmount(payment.amount.toString());
    setEditPhone(payment.phoneNumber);
    setEditReceipt(payment.mpesaReceiptNumber || "");
    setEditStatus(payment.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    setIsUpdating(true);
    try {
      const updates = {
        amount: Number(editAmount) || editingPayment.amount,
        phoneNumber: editPhone || editingPayment.phoneNumber,
        mpesaReceiptNumber: editReceipt || undefined,
        status: editStatus,
      };

      const res = await updatePaymentDetails(editingPayment._id, updates);
      if (res.success) {
        toast.success("Payment updated successfully");
        setData((prev) =>
          prev.map((p) =>
            p._id === editingPayment._id ? { ...p, ...updates, updatedAt: Date.now() } : p
          )
        );
        setEditingPayment(null);
      } else {
        toast.error(res.error || "Failed to update payment");
      }
    } catch {
      toast.error("Failed to update payment");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700">
            <CheckCircle2Icon className="h-3 w-3 text-emerald-600" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-700">
            <ClockIcon className="h-3 w-3 text-amber-600" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="gap-1 border-rose-300 bg-rose-50 text-rose-700">
            <XCircleIcon className="h-3 w-3 text-rose-600" />
            Failed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="gap-1 border-zinc-300 bg-zinc-50 text-zinc-700">
            <XCircleIcon className="h-3 w-3 text-zinc-500" />
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
          header: "Payment ID",
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
                    toast.success("Payment ID copied");
                  }}
                >
                  <CopyIcon className="h-3 w-3" />
                </Button>
              </div>
            );
          },
        }),

        columnHelper.accessor("amount", {
          header: "Amount (KES)",
          cell: ({ getValue }) => (
            <span className="font-semibold text-foreground">
              KES {getValue().toLocaleString()}
            </span>
          ),
        }),

        columnHelper.accessor("phoneNumber", {
          header: "Phone",
          cell: ({ getValue }) => (
            <div className="flex items-center gap-1 font-mono text-xs">
              <PhoneIcon className="h-3 w-3 text-muted-foreground" />
              <span>{getValue()}</span>
            </div>
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
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "completed")}>
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "pending")}>
                    Mark Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "failed")}>
                    Mark Failed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "cancelled")}>
                    Mark Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        }),

        columnHelper.accessor("mpesaReceiptNumber", {
          header: "M-PESA Receipt",
          cell: ({ getValue }) => {
            const receipt = getValue();
            if (!receipt) return <span className="text-xs text-muted-foreground">None</span>;
            return (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted font-medium">
                {receipt}
              </span>
            );
          },
        }),

        columnHelper.accessor("orderId", {
          header: "Order Ref",
          cell: ({ getValue }) => {
            const orderId = getValue();
            if (!orderId) return <span className="text-xs text-muted-foreground">Unlinked</span>;
            return (
              <span className="font-mono text-xs text-primary font-medium">
                #{orderId.slice(-8).toUpperCase()}
              </span>
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
                  <DropdownMenuItem onClick={() => setViewingPayment(row.original)}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openEditModal(row.original)}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit Payment
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Quick Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "completed")}>
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusUpdate(row.original._id, "failed")}>
                    Mark Failed
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
                    Delete Payment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        }),
      ]),
    [viewingPayment]
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
            placeholder="Search by ID, phone, receipt number..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
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
                    <CreditCardIcon className="h-8 w-8 text-muted-foreground/50" />
                    <span>No payments matching your criteria.</span>
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
            <Label htmlFor="payments-page-size" className="text-sm">Rows per page</Label>
            <Select
              value={`${table.state.pagination.pageSize}`}
              onValueChange={(val) => table.setPageSize(Number(val))}
            >
              <SelectTrigger size="sm" className="w-18" id="payments-page-size">
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

      {/* VIEW PAYMENT DETAILS DIALOG */}
      <Dialog open={!!viewingPayment} onOpenChange={(open: boolean) => !open && setViewingPayment(null)}>
        {viewingPayment && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between pr-4">
                <div>
                  <DialogTitle className="text-xl">
                    Payment #{viewingPayment._id.slice(-8).toUpperCase()}
                  </DialogTitle>
                  <DialogDescription>
                    Initiated on {viewingPayment.createdAt ? new Date(viewingPayment.createdAt).toLocaleString() : "N/A"}
                  </DialogDescription>
                </div>
                {getStatusBadge(viewingPayment.status)}
              </div>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Status Update Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-muted/60 border">
                <span className="text-sm font-medium">Update Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(["completed", "pending", "failed", "cancelled"] as Payment["status"][]).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={viewingPayment.status === st ? "default" : "outline"}
                      className="capitalize h-7 text-xs"
                      onClick={() => handleStatusUpdate(viewingPayment._id, st)}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transaction Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <CreditCardIcon className="h-4 w-4 text-primary" />
                    Transaction Info
                  </div>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Amount:</span>{" "}
                      <span className="text-base font-bold text-primary font-mono">
                        KES {viewingPayment.amount.toLocaleString()}
                      </span>
                    </p>
                    <p><span className="font-medium text-foreground">Phone:</span> {viewingPayment.phoneNumber}</p>
                    <p>
                      <span className="font-medium text-foreground">M-PESA Receipt:</span>{" "}
                      {viewingPayment.mpesaReceiptNumber ? (
                        <span className="font-mono font-semibold text-foreground">
                          {viewingPayment.mpesaReceiptNumber}
                        </span>
                      ) : (
                        "None recorded"
                      )}
                    </p>
                    {viewingPayment.transactionDate && (
                      <p><span className="font-medium text-foreground">Transaction Time:</span> {viewingPayment.transactionDate}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                    <FileTextIcon className="h-4 w-4 text-primary" />
                    M-Pesa Gateway References
                  </div>
                  <div className="text-xs space-y-1 font-mono text-muted-foreground">
                    {viewingPayment.orderId && (
                      <p>
                        <span className="font-sans font-medium text-foreground">Order Ref:</span>{" "}
                        <span className="text-primary font-bold">#{viewingPayment.orderId.slice(-8).toUpperCase()}</span>
                      </p>
                    )}
                    <p><span className="font-sans font-medium text-foreground">Session ID:</span> {viewingPayment.sessionId}</p>
                    {viewingPayment.checkoutRequestId && (
                      <p><span className="font-sans font-medium text-foreground">Checkout Req ID:</span> {viewingPayment.checkoutRequestId}</p>
                    )}
                    {viewingPayment.merchantRequestId && (
                      <p><span className="font-sans font-medium text-foreground">Merchant Req ID:</span> {viewingPayment.merchantRequestId}</p>
                    )}
                    {viewingPayment.resultCode && (
                      <p>
                        <span className="font-sans font-medium text-foreground">Result Code:</span>{" "}
                        <span className={viewingPayment.resultCode === "0" ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                          {viewingPayment.resultCode}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {viewingPayment.resultDesc && (
                <div className="rounded-lg border p-3 bg-muted/40 text-sm">
                  <span className="font-semibold block mb-1">Gateway Result Description:</span>
                  <p className="text-muted-foreground">{viewingPayment.resultDesc}</p>
                </div>
              )}

              {/* Raw Callback Data Preview */}
              {viewingPayment.callbackData && (
                <div className="space-y-1">
                  <span className="font-semibold text-xs block text-muted-foreground">
                    Raw M-PESA Callback Payload:
                  </span>
                  <pre className="p-3 bg-muted rounded-md text-xs font-mono max-h-48 overflow-y-auto text-foreground/80">
                    {JSON.stringify(viewingPayment.callbackData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(viewingPayment._id)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Payment
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewingPayment(null);
                    openEditModal(viewingPayment);
                  }}
                >
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewingPayment(null)}>
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* EDIT PAYMENT MODAL */}
      <Dialog open={!!editingPayment} onOpenChange={(open: boolean) => !open && setEditingPayment(null)}>
        {editingPayment && (
          <DialogContent className="max-w-md">
            <form onSubmit={handleSaveEdit}>
              <DialogHeader>
                <DialogTitle>Edit Payment</DialogTitle>
                <DialogDescription>
                  Manually adjust payment details or override transaction status.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="editAmt">Amount (KES)</Label>
                  <Input
                    id="editAmt"
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editPhone">Customer Phone</Label>
                  <Input
                    id="editPhone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editReceipt">M-PESA Receipt Number</Label>
                  <Input
                    id="editReceipt"
                    placeholder="e.g. QKH789234"
                    value={editReceipt}
                    onChange={(e) => setEditReceipt(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(val: any) => setEditStatus(val)}
                  >
                    <SelectTrigger id="editStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingPayment(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
