import { Metadata } from "next";

export const metadata: Metadata = {
  title: "忘記密碼",
  description: "重設您的密碼",
  openGraph: {
    title: "北科東校區宿委會 - 忘記密碼",
    description: "透過電子郵件重設您的密碼",
    url: "/login/forgot-password",
    type: "website",
  },
  twitter: {
    title: "北科東校區宿委會 - 忘記密碼",
    description: "透過電子郵件重設您的密碼",
  },
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/login/forgot-password",
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
