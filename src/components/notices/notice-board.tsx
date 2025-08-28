"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminClaims } from "@/hooks/use-admin";
import { useInfiniteNotices, useNotices } from "@/hooks/use-notices";
import { type Notice } from "@/types/notice";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { NoticeCard } from "./notice-card";
import { PinnedNotices } from "./pinned-notices";

export function NoticeBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { isAdmin } = useAdminClaims();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite query params
  const queryParams = useMemo(
    () => ({
      category:
        activeTab === "all"
          ? undefined
          : (activeTab as "events" | "announcements" | "maintenance"),
      search: searchTerm.trim() || undefined,
      pageSize: 8, // Load 8 notices at a time
    }),
    [activeTab, searchTerm]
  );

  const {
    notices,
    loading,
    loadingMore,
    hasNextPage,
    error,
    fetchNextPage,
    deleteNotice,
    togglePin,
  } = useInfiniteNotices(queryParams);

  // Get pinned notices separately
  const { notices: pinnedNotices } = useNotices({ pinned: true });

  // Intersection Observer for infinite loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && hasNextPage && !loadingMore) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, loadingMore]);

  const handleEditNotice = (notice: Notice) => {
    router.push(`/notices/${notice.id}/edit`);
  };

  const handleDeleteNotice = async (notice: Notice) => {
    try {
      await deleteNotice(notice.id);
    } catch {
      alert("刪除公告失敗，請再試一次。");
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      await togglePin(notice);
    } catch {
      alert("更新公告失敗，請再試一次。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Notice Board */}
          <div className="flex-1">
            <div className="mb-8">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">公告欄</h1>
                {isAdmin && (
                  <Button onClick={() => router.push("/notices/new")}>
                    建立公告
                  </Button>
                )}
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="events">活動</TabsTrigger>
                  <TabsTrigger value="announcements">公告</TabsTrigger>
                  <TabsTrigger value="maintenance">維護</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="搜尋公告"
                  className="bg-white pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                最新公告
              </h2>

              {error && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-lg bg-white p-4 shadow-md"
                    >
                      <div className="mb-4 aspect-[4/3] rounded bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-3 w-full rounded bg-gray-200"></div>
                        <div className="h-3 w-2/3 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {notices.length > 0 ? (
                      notices.map((notice, index) => (
                        <div
                          key={notice.id}
                          className="animate-in fade-in-0 slide-in-from-bottom-4"
                          style={{
                            animationDelay: `${(index % 8) * 100}ms`,
                            animationFillMode: "both",
                          }}
                        >
                          <NoticeCard
                            notice={notice}
                            onEdit={handleEditNotice}
                            onDelete={handleDeleteNotice}
                            onTogglePin={handleTogglePin}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center text-gray-500">
                        找不到任何公告。
                      </div>
                    )}
                  </div>

                  {/* Infinite loading trigger and indicator */}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className="flex justify-center py-8">
                      {loadingMore ? (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>載入更多公告...</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => fetchNextPage()}
                          disabled={loadingMore}
                        >
                          載入更多
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pinned Notices Sidebar */}
          <div className="w-full lg:w-80">
            <PinnedNotices notices={pinnedNotices} />
          </div>
        </div>
      </Container>
    </div>
  );
}
