"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientSession } from "@/types/database";

interface ClientSessionStore {
  session: ClientSession | null;
  setSession: (session: ClientSession) => void;
  clearSession: () => void;
  isValid: () => boolean;
}

/**
 * Zustand store for passwordless client reviewer sessions.
 * Persisted to localStorage so reviewers stay "logged in" across refreshes.
 * Used in the /review/[token] route.
 */
export const useClientSession = create<ClientSessionStore>()(
  persist(
    (set, get) => ({
      session: null,

      setSession: (session: ClientSession) => set({ session }),

      clearSession: () => set({ session: null }),

      isValid: () => {
        const { session } = get();
        if (!session) return false;
        return new Date(session.expiresAt) > new Date();
      },
    }),
    {
      name: "prefeed-client-session",
      // Only persist token + expiry (not sensitive data)
      partialize: (state) => ({ session: state.session }),
    }
  )
);
