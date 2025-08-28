import type { Metadata } from "next";
import { fetchNotice } from "@/lib/api/notices";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = params.id;
  try {
    const { notice } = await fetchNotice(id);
    const desc = notice.description || (notice.content ?? "").replace(/[#*_`>\-]/g, "").slice(0, 120);

    const images = notice.image ? [{ url: notice.image }] : undefined;
    return {
      title: notice.title,
      description: desc,
      openGraph: {
        title: notice.title,
        description: desc,
        url: `/notices/${id}`,
        images,
        type: "article",
      },
      twitter: {
        card: notice.image ? "summary_large_image" : "summary",
        title: notice.title,
        description: desc,
        images: notice.image ? [notice.image] : undefined,
      },
      alternates: {
        canonical: `/notices/${id}`,
      },
    };
  } catch {
    return {
      title: "公告",
      description: "公告內容",
      openGraph: {
        title: "公告",
        description: "公告內容",
        url: `/notices/${id}`,
        type: "article",
      },
      alternates: { canonical: `/notices/${id}` },
    };
  }
}

export default function NoticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
