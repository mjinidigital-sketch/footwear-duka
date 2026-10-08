import {
  isAuthenticatedNextjs,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { OrdersDataTable } from "@/components/orders-data-table";
import { getOrdersAdmin } from "@/app/actions";
import type { Order } from "@/components/orders-data-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
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

  const orders = await getOrdersAdmin();

  const transformedOrders: Order[] = (orders || []).map((o: any) => ({
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
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
              <p className="text-muted-foreground">
                Manage customer purchases, update fulfillment statuses, and view items
              </p>
            </div>
            <OrdersDataTable data={transformedOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
