"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { NoticeForm } from "@/components/notices/notice-form";
import * as noticeApi from "@/lib/api/notices";
import { type Notice } from "@/types/notice";
import { useAdminClaims } from "@/hooks/use-admin";

export default function EditNoticePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: aclLoading } = useAdminClaims();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const { notice } = await noticeApi.fetchNotice(id);
        if (mounted) setNotice(notice);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load notice");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Notice</h1>
          <p className="text-gray-600 mt-1">Update the details and image.</p>
        </div>
        {aclLoading ? (
          <div className="text-gray-600">Checking permissions...</div>
        ) : !isAdmin ? (
          <div className="text-gray-600">You do not have permission to edit notices.</div>
        ) : loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : notice ? (
          <NoticeForm mode="edit" initialNotice={notice} />
        ) : (
          <div className="text-gray-600">Notice not found.</div>
        )}
      </Container>
    </div>
  );
}
