"use client";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { NoticeForm } from "@/components/notices/notice-form";
import { useAdminClaims } from "@/hooks/use-admin";
import { useNotice } from "@/hooks/use-notice";

export default function EditNoticePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { notice, loading, error } = useNotice(id);
  const { isAdmin, loading: aclLoading } = useAdminClaims();

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">編輯公告</h1>
          <p className="text-gray-600 mt-1">更新詳細內容與圖片。</p>
        </div>
        {aclLoading ? (
          <div className="text-gray-600">檢查權限中…</div>
        ) : !isAdmin ? (
          <div className="text-gray-600">你沒有編輯公告的權限。</div>
        ) : loading ? (
          <div className="text-gray-600">載入中…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : notice ? (
          <NoticeForm mode="edit" initialNotice={notice} />
        ) : (
          <div className="text-gray-600">找不到公告。</div>
        )}
      </Container>
    </div>
  );
}
