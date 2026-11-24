"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_ACTIVITY } from "@/data/demo-activity";
import { createId } from "@/lib/utils";
import type { ActivityEntry, ActivityType } from "@/types/admin";

interface ActivityState {
  entries: ActivityEntry[];
  log: (
    input: Omit<ActivityEntry, "id" | "createdAt" | "adminName"> & {
      adminName?: string;
    }
  ) => void;
  reset: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      entries: SEED_ACTIVITY,
      log: (input) => {
        const entry: ActivityEntry = {
          id: createId("act"),
          type: input.type as ActivityType,
          description: input.description,
          entityType: input.entityType,
          entityId: input.entityId,
          adminName: input.adminName ?? "Demo Admin",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ entries: [entry, ...s.entries].slice(0, 200) }));
      },
      reset: () => set({ entries: SEED_ACTIVITY }),
    }),
    { name: "kendreah-activity" }
  )
);
