import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "註冊",
  description: "建立你的 北科東校區宿委會 帳號",
  openGraph: {
    title: "北科東校區宿委會 - 註冊",
    description: "建立您的帳戶以開始使用宿舍公告平台",
    url: "/register",
    type: "website",
  },
  twitter: {
    title: "北科東校區宿委會 - 註冊",
    description: "建立您的帳戶以開始使用宿舍公告平台",
  },
  alternates: {
    canonical: "/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
