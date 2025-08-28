import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入驗證",
  description: "正在驗證您的登入連結",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "登入驗證",
    description: "正在驗證您的登入連結",
    url: "/auth/callback",
  },
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
