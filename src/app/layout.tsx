import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "DormConnect 公告平台",
    template: "%s | DormConnect",
  },
  description: "宿舍公告與活動資訊平台",
  applicationName: "DormConnect",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DormConnect",
    title: "DormConnect 公告平台",
    description: "宿舍公告與活動資訊平台",
    locale: "zh_Hant",
  },
  twitter: {
    card: "summary_large_image",
    title: "DormConnect 公告平台",
    description: "宿舍公告與活動資訊平台",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
