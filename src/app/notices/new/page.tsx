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
          <h1 className="text-3xl font-bold text-gray-900">Create Notice</h1>
          <p className="text-gray-600 mt-1">Add a new announcement, event, or maintenance notice.</p>
        </div>
        {loading ? (
          <div className="text-gray-600">Checking permissions...</div>
        ) : isAdmin ? (
          <NoticeForm mode="create" />
        ) : (
          <div className="text-gray-600">You do not have permission to create notices.</div>
        )}
      </Container>
    </div>
  );
}
