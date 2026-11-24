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
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
  inverted?: boolean;
}) {
  const crown =
    size === "xs"
      ? "h-3.5 w-5"
      : size === "sm"
        ? "h-4 w-6"
        : size === "lg"
          ? "h-10 w-14"
          : "h-7 w-10";
  const script =
    size === "xs"
      ? "text-[1.25rem] leading-none"
      : size === "sm"
        ? "text-xl leading-none"
        : size === "lg"
          ? "text-5xl"
          : "text-3xl";
  const store =
    size === "sm" ? "text-[0.5rem] leading-none" : "text-[0.68rem]";
  const showStoreLabel = size !== "xs";
  const inlineMobile = size === "xs";

  const content = (
    <span
      className={cn(
        inverted ? "text-white" : "text-ink",
        inlineMobile
          ? "inline-flex max-h-10 items-center gap-1.5"
          : "inline-flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <CrownIcon className={crown} />
      <span
        className={cn(
          inlineMobile ? "inline-flex flex-col items-start" : "contents"
        )}
      >
        <span
          className={cn(
            "script-wordmark",
            !inlineMobile && "mt-0.5",
            script,
            inverted ? "text-white" : "text-pink"
          )}
        >
          Ken&apos; Dreah
        </span>
        {showStoreLabel && (
          <span
            className={cn(
              "store-label",
              size === "sm" ? "mt-0.5" : "mt-1",
              store,
              inverted ? "text-white/80" : "text-ink/70"
            )}
          >
            Online Store
          </span>
        )}
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
    <Link
      href={href}
      className="inline-flex max-h-full items-center"
      aria-label="Ken' Dreah Online Store home"
    >
      {content}
    </Link>
  );
}
