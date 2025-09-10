import type { Metadata } from "next";
import { NoticeBoard } from "@/components/notices";

export const metadata: Metadata = {
  title: "首頁",
  description: "瀏覽最新的宿舍公告、活動資訊和維護通知",
  openGraph: {
    title: "北科東校區宿委會 - 首頁",
    description: "瀏覽最新的宿舍公告、活動資訊和維護通知",
    url: "/",
  },
  twitter: {
    title: "北科東校區宿委會 - 首頁",
    description: "瀏覽最新的宿舍公告、活動資訊和維護通知",
  },
};

export default function Home() {
  return (
    <div>
      <NoticeBoard />
    </div>
  );
}
