"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EditProductClient } from "../[id]/edit-client";

function EditByQuery() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  if (!id) {
    return (
      <p className="text-sm text-admin-muted">
        Missing product id. Open a product from the catalog.
      </p>
    );
  }
  return <EditProductClient id={id} />;
}

export default function AdminProductEditPage() {
  return (
    <Suspense fallback={<p className="text-sm text-admin-muted">Loading…</p>}>
      <EditByQuery />
    </Suspense>
  );
}
