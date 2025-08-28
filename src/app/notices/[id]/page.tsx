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

  const categoryLabel = useMemo(() => {
    if (!notice) return "";
    switch (notice.category) {
      case "events":
        return "活動";
      case "announcements":
        return "公告";
      case "maintenance":
        return "維護";
      default:
        return notice.category;
    }
  }, [notice]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")}>
            ← 返回
          </Button>
          {isAdmin && notice && (
            <Button onClick={() => router.push(`/notices/${notice.id}/edit`)}>
              編輯
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-gray-600">載入中…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !notice ? (
          <div className="text-gray-600">找不到公告。</div>
        ) : (
          <article className="overflow-hidden rounded-lg bg-white shadow-sm">
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
              <div className="mb-4 flex items-center gap-3">
                <Badge className={categoryColor}>{categoryLabel}</Badge>
                {notice.isPinned && (
                  <Badge className="bg-yellow-500 text-white">置頂</Badge>
                )}
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {notice.title}
              </h1>
              {notice.description && (
                <p className="mb-6 text-gray-700">{notice.description}</p>
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
