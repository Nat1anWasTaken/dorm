"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useNotices } from "@/hooks/use-notices";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoticeCard } from "./notice-card";
import { PinnedNotices } from "./pinned-notices";
import { type Notice } from "@/types/notice";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAdminClaims } from "@/hooks/use-admin";

export function NoticeBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { isAdmin } = useAdminClaims();
  

  // Fetch notices with current filters
  const queryParams = useMemo(() => ({
    category: activeTab === "all" ? undefined : activeTab as "events" | "announcements" | "maintenance",
    search: searchTerm.trim() || undefined,
    limit: 50, // Reasonable limit for now
  }), [activeTab, searchTerm]);

  const { 
    notices, 
    loading, 
    error, 
    deleteNotice, 
    togglePin,
  } = useNotices(queryParams);

  const handleEditNotice = (notice: Notice) => {
    router.push(`/notices/${notice.id}/edit`);
  };

  const handleDeleteNotice = async (notice: Notice) => {
    if (confirm(`Are you sure you want to delete "${notice.title}"?`)) {
      try {
        await deleteNotice(notice.id);
      } catch {
        alert("Failed to delete notice. Please try again.");
      }
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      await togglePin(notice);
    } catch {
      alert("Failed to update notice. Please try again.");
    }
  };

  const pinnedNotices = notices.filter(notice => notice.isPinned);

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Notice Board */}
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
                {isAdmin && (
                  <Button onClick={() => router.push("/notices/new")}>Create Notice</Button>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notices"
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Notices</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {notices.length > 0 ? (
                    notices.map((notice) => (
                      <NoticeCard 
                        key={notice.id} 
                        notice={notice}
                        onEdit={handleEditNotice}
                        onDelete={handleDeleteNotice}
                        onTogglePin={handleTogglePin}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No notices found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center items-center space-x-2">
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                ‹
              </button>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">
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
