import Link from "next/link";
import { cn } from "@/lib/utils";

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 64 44"
      aria-hidden="true"
    >
      <path
        d="M6 38 L2 12 L18 24 L32 6 L46 24 L62 12 L58 38 Z"
        fill="#d4af37"
        stroke="#9a7611"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="9" r="3.4" fill="#ec008c" />
      <circle cx="32" cy="4" r="3.4" fill="#ec008c" />
      <circle cx="62" cy="9" r="3.4" fill="#ec008c" />
      <rect x="6" y="38" width="52" height="4" rx="2" fill="#d4af37" />
    </svg>
  );
}

export function BrandLogo({
  href = "/",
  size = "md",
  className,
  showTagline = false,
  inverted = false,
}: {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
  inverted?: boolean;
}) {
  const crown =
    size === "sm" ? "h-5 w-7" : size === "lg" ? "h-10 w-14" : "h-7 w-10";
  const script =
    size === "sm" ? "text-2xl" : size === "lg" ? "text-5xl" : "text-3xl";
  const store = size === "sm" ? "text-[0.55rem]" : "text-[0.68rem]";

  const content = (
    <span
      className={cn(
        "inline-flex flex-col items-center text-center",
        inverted ? "text-white" : "text-ink",
        className
      )}
    >
      <CrownIcon className={crown} />
      <span
        className={cn(
          "script-wordmark mt-0.5",
          script,
          inverted ? "text-white" : "text-pink"
        )}
      >
        Ken&apos; Dreah
      </span>
      <span
        className={cn(
          "store-label mt-1",
          store,
          inverted ? "text-white/80" : "text-ink/70"
        )}
      >
        Online Store
      </span>
      {showTagline && (
        <span
          className={cn(
            "mt-2 text-xs tracking-[0.18em]",
            inverted ? "text-gold" : "text-muted"
          )}
        >
          Shop • Save • Enjoy
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-block" aria-label="Ken' Dreah Online Store home">
      {content}
    </Link>
  );
}
