import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "公告欄",
  description: "瀏覽最新公告與活動資訊",
  openGraph: {
    title: "公告欄",
    description: "瀏覽最新公告與活動資訊",
    url: "/notice-board",
  },
};

export default function NoticeBoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

