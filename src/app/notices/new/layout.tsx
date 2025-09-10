import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "建立公告",
  description: "新增一則宿舍公告",
  openGraph: {
    title: "北科東校區宿委會 - 建立公告",
    description: "建立新的宿舍公告、活動或維護通知",
    url: "/notices/new",
    type: "website",
  },
  twitter: {
    title: "北科東校區宿委會 - 建立公告",
    description: "建立新的宿舍公告、活動或維護通知",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/notices/new",
  },
};

export default function NewNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
