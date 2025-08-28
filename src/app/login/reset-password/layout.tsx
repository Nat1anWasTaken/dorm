import { Metadata } from "next";

export const metadata: Metadata = {
  title: "重設密碼",
  description: "設定您的新密碼",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}