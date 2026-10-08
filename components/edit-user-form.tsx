"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { updateUserProfile } from "@/app/actions"
import { PencilIcon, Loader2Icon, XIcon } from "lucide-react"

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.union([
    z.literal("admin"),
    z.literal("staff"),
    z.literal("user"),
    z.literal("customer"),
  ]),
  phone: z.string().optional(),
  isActive: z.boolean(),
})

type UpdateUserFormValues = z.infer<typeof updateUserSchema>

interface EditUserFormProps {
  user: {
    _id: string
    name?: string
    email?: string
    role?: string
    phone?: string
    isActive?: boolean
  }
  onSuccess?: () => void
}

export function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      role: (user.role as any) || "user",
      phone: user.phone || "",
      isActive: user.isActive ?? true,
    },
  })

  const onSubmit = async (data: UpdateUserFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await updateUserProfile({
        targetUserId: user._id,
        ...data,
      })
      if (result.success) {
        toast.success("User updated successfully")
        form.reset()
        setIsOpen(false)
        onSuccess?.()
      } else {
        toast.error(result.error || "Failed to update user")
      }
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || "An error occurred while updating the user"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setIsOpen(true)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

      {/* Sidebar Form */}
      <div
        className={`bg-background fixed top-0 right-0 z-50 h-full w-full transform border-l shadow-xl transition-transform duration-300 sm:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold">Edit User</h2>
              <p className="text-muted-foreground text-sm">
                Update user information
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                {...form.register("name")}
                disabled={isSubmitting}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="john@example.com"
                {...form.register("email")}
                disabled={isSubmitting}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value as any)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-phone">Phone Number (Optional)</Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+1 234 567 8900"
                {...form.register("phone")}
                disabled={isSubmitting}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={form.watch("isActive") ? "active" : "inactive"}
                onValueChange={(value) => form.setValue("isActive", value === "active")}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.formState.errors.isActive && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.isActive.message}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
