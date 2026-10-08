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
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  TrashIcon,
  ShieldIcon,
} from "lucide-react"
import { updateUserRole, deleteUser } from "@/app/actions"
import { AddUserForm } from "@/components/add-user-form"
import { EditUserForm } from "@/components/edit-user-form"

// User schema matching Convex schema
export const userSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.union([
    z.literal("admin"),
    z.literal("staff"),
    z.literal("user"),
    z.literal("customer"),
  ]).optional(),
  image: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  lastLoginAt: z.number().optional(),
  isActive: z.boolean().optional(),
})

export type User = z.infer<typeof userSchema>

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

const columnHelper = createColumnHelper<typeof features, User>()

export function UsersDataTable({
  data: initialData,
}: {
  data: User[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const { getUsers } = await import("@/app/actions")
      const users = await getUsers()
      const transformedUsers: User[] = users.map((u: any) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        image: u.image,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        lastLoginAt: u.lastLoginAt,
        isActive: u.isActive ?? true,
      }))
      setData(transformedUsers)
    } catch (error) {
      toast.error("Failed to refresh users")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Filter data based on search query, role, and status
  const filteredData = React.useMemo(() => {
    let result = data

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(query) ||
          (user.email?.toLowerCase() || "").includes(query)
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      result = result.filter((user) => (user.isActive ?? true) === isActive)
    }

    return result
  }, [data, searchQuery, roleFilter, statusFilter])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = columnHelper.columns([
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
      header: "Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <span className="font-medium">{user.name || "Unknown"}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email || "N/A"}</span>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role
        const roleColors = {
          admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          staff: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          user: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          customer: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        }
        return (
          <Badge variant="outline" className={roleColors[role as keyof typeof roleColors] || ""}>
            <ShieldIcon className="mr-1 h-3 w-3" />
            {role || "user"}
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
    columnHelper.accessor("lastLoginAt", {
      header: "Last Login",
      cell: ({ row }) => {
        const lastLoginAt = row.original.lastLoginAt
        if (!lastLoginAt) return <span className="text-muted-foreground">Never</span>
        const date = new Date(lastLoginAt)
        return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>
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
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <EditUserForm user={row.original} onSuccess={refreshData} />
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={async () => {
                  toast.promise(
                    updateUserRole(row.original._id, "admin").then(() => refreshData()),
                    {
                      loading: "Updating role...",
                      success: "Role updated to admin",
                      error: (error: any) => error?.error || error?.message || "Failed to update role",
                    }
                  )
                }}
              >
                <ShieldIcon className="mr-2 h-4 w-4" />
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  toast.promise(
                    updateUserRole(row.original._id, "staff").then(() => refreshData()),
                    {
                      loading: "Updating role...",
                      success: "Role updated to staff",
                      error: (error: any) => error?.error || error?.message || "Failed to update role",
                    }
                  )
                }}
              >
                <ShieldIcon className="mr-2 h-4 w-4" />
                Make Staff
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  toast.promise(
                    updateUserRole(row.original._id, "user").then(() => refreshData()),
                    {
                      loading: "Updating role...",
                      success: "Role updated to user",
                      error: (error: any) => error?.error || error?.message || "Failed to update role",
                    }
                  )
                }}
              >
                <ShieldIcon className="mr-2 h-4 w-4" />
                Make User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={async () => {
                  toast.promise(
                    deleteUser(row.original._id).then(() => refreshData()),
                    {
                      loading: "Deleting user...",
                      success: "User deleted successfully",
                      error: (error: any) => error?.error || error?.message || "Failed to delete user",
                    }
                  )
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
  ])

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
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="max-w-sm"
          />
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value ?? "all")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="w-[140px]">
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
          <AddUserForm onSuccess={refreshData} />
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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
