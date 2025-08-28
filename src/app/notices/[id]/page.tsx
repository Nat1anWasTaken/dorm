"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { NoticeMarkdownRenderer } from "@/components/notices/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useAdminClaims } from "@/hooks/use-admin";
import { useNotice } from "@/hooks/use-notice";

export default function NoticeReadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const { isAdmin } = useAdminClaims();
  const { notice, loading, error } = useNotice(id);

  const categoryColor = useMemo(() => {
    if (!notice) return "bg-gray-100 text-gray-800";
    switch (notice.category) {
      case "events":
        return "bg-green-100 text-green-800";
      case "announcements":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, [notice]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")}>
            ← Back
          </Button>
          {isAdmin && notice && (
            <Button onClick={() => router.push(`/notices/${notice.id}/edit`)}>
              Edit
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !notice ? (
          <div className="text-gray-600">Notice not found.</div>
        ) : (
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {notice.image ? (
              <div className="relative aspect-[16/6] bg-gray-100">
                <Image
                  src={notice.image}
                  alt={notice.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={categoryColor}>
                  {notice.category.charAt(0).toUpperCase() +
                    notice.category.slice(1)}
                </Badge>
                {notice.isPinned && (
                  <Badge className="bg-yellow-500 text-white">Pinned</Badge>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {notice.title}
              </h1>
              {notice.description && (
                <p className="text-gray-700 mb-6">{notice.description}</p>
              )}

              <div className="prose prose-neutral max-w-none">
                <NoticeMarkdownRenderer markdown={notice.content} />
              </div>
            </div>
          </article>
        )}
      </Container>
    </div>
  );
}
