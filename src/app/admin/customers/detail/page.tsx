"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerDetailClient } from "../[id]/customer-client";

function DetailByQuery() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  if (!id) {
    return (
      <p className="text-sm text-admin-muted">
        Missing customer id. Open a customer from the directory.
      </p>
    );
  }
  return <CustomerDetailClient id={id} />;
}

export default function AdminCustomerDetailQueryPage() {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Loading…</p>}>
      <DetailByQuery />
    </Suspense>
  );
}
