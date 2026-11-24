"use client";

import Link from "next/link";
import { cn, formatUSD } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-admin-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export function AdminCard({
  children,
  className,
  title,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn("border border-border bg-white p-4 sm:p-5", className)}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-sm font-semibold text-ink">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function KpiCard({
  label,
  value,
  change,
  comparison,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: number;
  comparison: string;
  icon: LucideIcon;
}) {
  const up = change >= 0;
  return (
    <AdminCard className="!p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-admin-muted">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-ink">
            {value}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center bg-pink-blush text-pink">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-admin-muted">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-semibold",
            up ? "text-success" : "text-danger"
          )}
        >
          {up ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {Math.abs(change).toFixed(1)}%
        </span>
        <span>{comparison}</span>
      </p>
    </AdminCard>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "pink" | "gold" | "ink" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    pink: "bg-pink-blush text-pink-deep",
    gold: "bg-gold/15 text-gold-deep",
    ink: "bg-neutral text-ink",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    info: "bg-info/10 text-info",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        styles[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-border bg-white px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-admin-muted">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Money({ amount }: { amount: number }) {
  return <span className="tabular-nums">{formatUSD(amount)}</span>;
}

export function AdminLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-sm font-medium text-pink hover:underline">
      {children}
    </Link>
  );
}
