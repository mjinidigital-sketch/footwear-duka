import {
  isAuthenticatedNextjs,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { UsersDataTable } from "@/components/users-data-table";
import { getUsers } from "@/app/actions";
import type { User } from "@/components/users-data-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsersPage() {
  const authenticated = await isAuthenticatedNextjs();
  if (!authenticated) {
    redirect("/login");
  }

  const user = await fetchQuery(
    api.users.viewer,
    {},
    { token: await convexAuthNextjsToken() },
  );

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Fetch users from server action with error handling
  const users = await getUsers();

  // Transform users to match the User schema
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
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">
                Manage user accounts and permissions
              </p>
            </div>
            <UsersDataTable data={transformedUsers} />
          </div>
        </div>
      </div>
    </div>
  );
}
