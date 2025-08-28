"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as noticeApi from "@/lib/api/notices";

export const noticesKeys = {
  all: ["notices"] as const,
  list: (params?: unknown) => ["notices", params] as const,
  detail: (id?: string) => ["notice", id] as const,
};

export function useNotices(params?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  pinned?: boolean;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: noticesKeys.list(params),
    queryFn: () => noticeApi.fetchNotices(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  const invalidateLists = async () => {
    await queryClient.invalidateQueries({ queryKey: noticesKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: noticeApi.createNotice,
    onSuccess: () => void invalidateLists(),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof noticeApi.updateNotice>[1];
    }) => noticeApi.updateNotice(id, data),
    onSuccess: (_res, variables) => {
      void invalidateLists();
      // also update detail cache for this id
      queryClient.invalidateQueries({
        queryKey: noticesKeys.detail(variables.id),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: noticeApi.deleteNotice,
    onSuccess: () => void invalidateLists(),
  });

  const togglePinMutation = useMutation({
    mutationFn: noticeApi.toggleNoticePin,
    onSuccess: (_res, notice) => {
      void invalidateLists();
      queryClient.invalidateQueries({
        queryKey: noticesKeys.detail(notice.id),
      });
    },
  });

  return {
    notices: query.data?.notices ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    error: (query.error as Error | null)?.message ?? null,
    refreshNotices: query.refetch,
    createNotice: createMutation.mutateAsync,
    updateNotice: (
      id: string,
      data: Parameters<typeof noticeApi.updateNotice>[1]
    ) => updateMutation.mutateAsync({ id, data }),
    deleteNotice: deleteMutation.mutateAsync,
    togglePin: togglePinMutation.mutateAsync,
  } as const;
}
