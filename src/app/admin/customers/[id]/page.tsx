import { SEED_CUSTOMERS } from "@/data/demo-customers";
import { CustomerDetailClient } from "./customer-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return SEED_CUSTOMERS.map((c) => ({ id: c.id }));
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CustomerDetailClient id={id} />;
}
