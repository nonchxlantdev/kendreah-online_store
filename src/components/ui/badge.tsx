import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "ink",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "ink" | "pink" | "gold" | "sale";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tone === "ink" && "bg-ink text-soft-white",
        tone === "pink" && "bg-pink text-white",
        tone === "gold" && "bg-gold text-ink",
        tone === "sale" && "bg-pink text-white",
        className
      )}
    >
      {children}
    </span>
  );
}
