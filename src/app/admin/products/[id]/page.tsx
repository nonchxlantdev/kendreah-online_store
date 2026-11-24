import { INITIAL_PRODUCTS } from "@/data/products";
import { EditProductClient } from "./edit-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({ id: product.id }));
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  return <EditProductClient id={id} />;
}
