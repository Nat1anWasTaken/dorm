"use client";

import { Container } from "@/components/ui/container";
import { NoticeForm } from "@/components/notices/notice-form";
import { useAdminClaims } from "@/hooks/use-admin";

export default function NewNoticePage() {
  const { isAdmin, loading } = useAdminClaims();
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">建立公告</h1>
          <p className="mt-1 text-gray-600">新增公告、活動或維護通知。</p>
        </div>
        {loading ? (
          <div className="text-gray-600">檢查權限中…</div>
        ) : isAdmin ? (
          <NoticeForm mode="create" />
        ) : (
          <div className="text-gray-600">你沒有建立公告的權限。</div>
        )}
      </Container>
    </div>
  );
}
