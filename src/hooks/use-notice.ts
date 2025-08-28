"use client";

import { useQuery } from "@tanstack/react-query";
import * as noticeApi from "@/lib/api/notices";
import type { Notice } from "@/types/notice";
import { noticesKeys } from "./use-notices";

export function useNotice(id?: string) {
  const query = useQuery({
    queryKey: noticesKeys.detail(id),
    queryFn: async () => {
      if (!id) throw new Error("Missing notice id");
      const { notice } = await noticeApi.fetchNotice(id);
      return notice as Notice;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  return {
    notice: query.data ?? null,
    loading: query.isLoading,
    error: (query.error as Error | null)?.message ?? null,
    refetch: query.refetch,
  } as const;
}
