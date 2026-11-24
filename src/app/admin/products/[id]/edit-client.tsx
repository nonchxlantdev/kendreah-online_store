"use client";

import Link from "next/link";
import { ProductEditor } from "@/components/admin/product-editor";
import { EmptyState } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { useIsClient } from "@/hooks/use-is-client";
import { useCatalogStore } from "@/store/catalog-store";

export function EditProductClient({ id }: { id: string }) {
  const mounted = useIsClient();
  const product = useCatalogStore((s) => s.getProduct(id));

  if (!mounted) {
    return <p className="text-sm text-admin-muted">Loading…</p>;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been deleted in this browser."
        action={
          <Button asChild variant="pink">
            <Link href="/admin/products">Back to products</Link>
          </Button>
        }
      />
    );
  }

  return <ProductEditor product={product} />;
}
