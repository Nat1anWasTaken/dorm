import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "活動",
  description: "宿舍活動與事件資訊",
  openGraph: {
    title: "活動",
    description: "宿舍活動與事件資訊",
    url: "/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
