import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入",
  description: "登入 北科東校區宿委會 管理與公告平台",
  openGraph: {
    title: "北科東校區宿委會 - 登入",
    description: "登入您的帳戶以查看公告和活動資訊",
    url: "/login",
    type: "website",
  },
  twitter: {
    title: "北科東校區宿委會 - 登入",
    description: "登入您的帳戶以查看公告和活動資訊",
  },
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
