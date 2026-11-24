"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  isAuthenticated: boolean;
  adminName: string;
  adminEmail: string;
  enterDemo: () => void;
  signInDemo: (email: string) => void;
  signOut: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminName: "Demo Admin",
      adminEmail: "admin@kendreah.demo",
      enterDemo: () =>
        set({
          isAuthenticated: true,
          adminName: "Demo Admin",
          adminEmail: "admin@kendreah.demo",
        }),
      signInDemo: (email) =>
        set({
          isAuthenticated: true,
          adminName: "Demo Admin",
          adminEmail: email.trim() || "admin@kendreah.demo",
        }),
      signOut: () =>
        set({
          isAuthenticated: false,
        }),
    }),
    { name: "kendreah-admin-auth" }
  )
);
