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
