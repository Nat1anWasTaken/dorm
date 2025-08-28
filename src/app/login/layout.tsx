import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入",
  description: "登入 DormConnect 管理與公告平台",
  openGraph: {
    title: "登入",
    description: "登入 DormConnect 管理與公告平台",
    url: "/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

