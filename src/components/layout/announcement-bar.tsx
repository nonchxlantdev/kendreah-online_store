"use client";

import { useStorefrontStore } from "@/store/storefront-store";

export function AnnouncementBar() {
  const announcement = useStorefrontStore((s) => s.published.announcement);
  if (!announcement.visible) return null;

  return (
    <div
      className="px-3 py-2 text-center text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] text-white sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-[0.12em]"
      style={{ backgroundColor: announcement.backgroundColor }}
    >
      {announcement.text}
    </div>
  );
}
