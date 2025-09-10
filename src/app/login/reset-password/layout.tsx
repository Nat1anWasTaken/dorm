import { Metadata } from "next";

export const metadata: Metadata = {
  title: "重設密碼",
  description: "設定您的新密碼",
  openGraph: {
    title: "北科東校區宿委會 - 重設密碼",
    description: "為您的帳戶設定新的密碼",
    url: "/login/reset-password",
    type: "website",
  },
  twitter: {
    title: "北科東校區宿委會 - 重設密碼",
    description: "為您的帳戶設定新的密碼",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login/reset-password",
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
