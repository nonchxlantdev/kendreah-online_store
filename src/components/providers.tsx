"use client";

import { Toaster } from "sonner";
import { useIsClient } from "@/hooks/use-is-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const mounted = useIsClient();

  return (
    <>
      {children}
      {mounted && (
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#150E13",
              color: "#FFF8FB",
              border: "1px solid #D4AF37",
              borderRadius: 2,
            },
          }}
        />
      )}
    </>
  );
}
