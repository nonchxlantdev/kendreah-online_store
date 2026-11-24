import { SEED_ORDERS } from "@/data/demo-orders";
import { OrderDetailClient } from "./order-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return SEED_ORDERS.map((order) => ({ id: order.id }));
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
