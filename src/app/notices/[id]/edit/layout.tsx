import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "編輯公告",
  description: "編輯宿舍公告內容",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "北科東校區宿委會 - 編輯公告",
    description: "更新公告的詳細內容與圖片",
    type: "website",
  },
  twitter: {
    title: "北科東校區宿委會 - 編輯公告",
    description: "更新公告的詳細內容與圖片",
  },
};

export default function EditNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
