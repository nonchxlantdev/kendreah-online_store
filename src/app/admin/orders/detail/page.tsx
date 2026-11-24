"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderDetailClient } from "../[id]/order-client";

function DetailByQuery() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  if (!id) {
    return (
      <p className="text-sm text-admin-muted">
        Missing order id. Open an order from the orders list.
      </p>
    );
  }
  return <OrderDetailClient id={id} />;
}

export default function AdminOrderDetailQueryPage() {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Loading…</p>}>
      <DetailByQuery />
    </Suspense>
  );
}
