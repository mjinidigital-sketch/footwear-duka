import {
  isAuthenticatedNextjs,
  convexAuthNextjsToken,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { PaymentsDataTable } from "@/components/payments-data-table";
import { getPaymentsAdmin } from "@/app/actions";
import type { Payment } from "@/components/payments-data-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPaymentsPage() {
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

  const payments = await getPaymentsAdmin();

  const transformedPayments: Payment[] = (payments || []).map((p: any) => ({
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
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
              <p className="text-muted-foreground">
                Audit transactions, track M-PESA receipts, and manage payment statuses
              </p>
            </div>
            <PaymentsDataTable data={transformedPayments} />
          </div>
        </div>
      </div>
    </div>
  );
}
