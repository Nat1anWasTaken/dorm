import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "註冊",
  description: "建立你的 DormConnect 帳號",
  openGraph: {
    title: "註冊",
    description: "建立你的 DormConnect 帳號",
    url: "/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

