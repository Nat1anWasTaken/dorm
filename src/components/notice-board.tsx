"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoticeCard, Notice } from "./notice-card";
import { PinnedNotices } from "./pinned-notices";

// Placeholder data - replace with database integration
const sampleNotices: Notice[] = [
  {
    id: "1",
    title: "Dormitory Social Night",
    description: "Join us for a night of fun and games!",
    category: "events",
    image: "/placeholder-social.jpg",
    isPinned: true,
    createdAt: "2024-01-20",
  },
  {
    id: "2", 
    title: "Maintenance Schedule",
    description: "Check the schedule for upcoming maintenance.",
    category: "maintenance",
    image: "/placeholder-maintenance.jpg",
    isPinned: true,
    createdAt: "2024-01-19",
  },
  {
    id: "3",
    title: "New Study Room Rules",
    description: "Please review the new rules for the study room.",
    category: "announcements",
    image: "/placeholder-study.jpg",
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    title: "Upcoming Guest Speaker",
    description: "Don't miss our guest speaker this week.",
    category: "events",
    image: "/placeholder-speaker.jpg",
    createdAt: "2024-01-17",
  },
];

export function NoticeBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotices = sampleNotices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "all" || notice.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotices = sampleNotices.filter(notice => notice.isPinned);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Notice Board */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Notice Board</h1>
              
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredNotices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
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
      </div>
    </div>
  );
}