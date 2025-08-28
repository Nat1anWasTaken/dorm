"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminClaims } from "@/hooks/use-admin";
import { useNotices } from "@/hooks/use-notices";
import { type Notice } from "@/types/notice";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { NoticeCard } from "./notice-card";
import { PinnedNotices } from "./pinned-notices";

export function NoticeBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { isAdmin } = useAdminClaims();

  // Fetch notices with current filters
  const queryParams = useMemo(
    () => ({
      category:
        activeTab === "all"
          ? undefined
          : (activeTab as "events" | "announcements" | "maintenance"),
      search: searchTerm.trim() || undefined,
      limit: 50, // Reasonable limit for now
    }),
    [activeTab, searchTerm]
  );

  const { notices, loading, error, deleteNotice, togglePin } =
    useNotices(queryParams);

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

  const pinnedNotices = notices.filter(notice => notice.isPinned);

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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {notices.length > 0 ? (
                    notices.map(notice => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        onEdit={handleEditNotice}
                        onDelete={handleDeleteNotice}
                        onTogglePin={handleTogglePin}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-500">
                      找不到任何公告。
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex items-center justify-center space-x-2">
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                ‹
              </button>
              <button className="rounded bg-blue-600 px-3 py-2 text-sm text-white">
                1
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                2
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                3
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                4
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                5
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                ›
              </button>
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
