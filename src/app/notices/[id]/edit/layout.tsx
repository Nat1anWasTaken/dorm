import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "編輯公告",
  description: "編輯宿舍公告內容",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "編輯公告",
    description: "編輯宿舍公告內容",
  },
};

export default function EditNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
