"use client";

import { useState, useEffect } from "react";
import { type Notice } from "@/types/notice";
import * as noticeApi from "@/lib/api/notices";

export function useNotices(params?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  pinned?: boolean;
}) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotices() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await noticeApi.fetchNotices(params);
        setNotices(response.notices);
        setTotal(response.total);
      } catch (err) {
        console.error("Error fetching notices:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch notices");
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, [params]);

  const refreshNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await noticeApi.fetchNotices(params);
      setNotices(response.notices);
      setTotal(response.total);
    } catch (err) {
      console.error("Error refreshing notices:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh notices");
    } finally {
      setLoading(false);
    }
  };

  const createNotice = async (data: Parameters<typeof noticeApi.createNotice>[0]) => {
    try {
      await noticeApi.createNotice(data);
      await refreshNotices(); // Refresh the list after creating
    } catch (err) {
      console.error("Error creating notice:", err);
      throw err;
    }
  };

  const updateNotice = async (id: string, data: Parameters<typeof noticeApi.updateNotice>[1]) => {
    try {
      await noticeApi.updateNotice(id, data);
      await refreshNotices(); // Refresh the list after updating
    } catch (err) {
      console.error("Error updating notice:", err);
      throw err;
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      await noticeApi.deleteNotice(id);
      await refreshNotices(); // Refresh the list after deleting
    } catch (err) {
      console.error("Error deleting notice:", err);
      throw err;
    }
  };

  const togglePin = async (notice: Notice) => {
    try {
      await noticeApi.toggleNoticePin(notice);
      await refreshNotices(); // Refresh the list after toggling pin
    } catch (err) {
      console.error("Error toggling pin:", err);
      throw err;
    }
  };

  return {
    notices,
    total,
    loading,
    error,
    refreshNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    togglePin,
  };
}