import { Metadata } from "next";

export const metadata: Metadata = {
  title: "忘記密碼",
  description: "重設您的密碼",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
