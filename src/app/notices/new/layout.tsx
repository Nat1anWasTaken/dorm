import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "建立公告",
  description: "新增一則宿舍公告",
  openGraph: {
    title: "建立公告",
    description: "新增一則宿舍公告",
    url: "/notices/new",
  },
  robots: {
    index: false,
  },
};

export default function NewNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
