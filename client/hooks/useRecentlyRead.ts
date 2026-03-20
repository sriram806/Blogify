import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "blogify.recently_read.v1";
const MAX_ENTRIES = 5;

export type RecentlyReadEntry = {
  id: string;
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  visitedAt: number;
};

export function useRecentlyRead() {
  const [recentlyRead, setRecentlyRead] = useState<RecentlyReadEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentlyReadEntry[];
        if (Array.isArray(parsed)) {
          setRecentlyRead(parsed.slice(0, MAX_ENTRIES));
        }
      }
    } catch {
      // ignore read errors
    }
  }, []);

  const recordView = useCallback(
    (entry: Omit<RecentlyReadEntry, "visitedAt">) => {
      if (typeof window === "undefined") return;

      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const existing: RecentlyReadEntry[] = raw ? (JSON.parse(raw) as RecentlyReadEntry[]) : [];

        // Dedup + newest first
        const deduped = [
          { ...entry, visitedAt: Date.now() },
          ...existing.filter((e) => e.id !== entry.id),
        ].slice(0, MAX_ENTRIES);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
        setRecentlyRead(deduped);
      } catch {
        // ignore write errors
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentlyRead([]);
    } catch {
      // ignore
    }
  }, []);

  return { recentlyRead, recordView, clearHistory, mounted };
}
