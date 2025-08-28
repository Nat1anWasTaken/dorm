import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Notice } from "@/types/notice";

interface PinnedNoticesProps {
  notices: Notice[];
}

export function PinnedNotices({ notices }: PinnedNoticesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">置頂公告</h2>

      <div className="space-y-4">
        {notices.map(notice => (
          <Card
            key={notice.id}
            className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
          >
            <div className="flex">
              <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100">
                {notice.image ? (
                  <Image
                    src={notice.image}
                    alt={notice.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-lg text-gray-500">📋</span>
                  </div>
                )}
              </div>
              <CardContent className="flex-1 p-3">
                <div className="mb-1 flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    置頂
                  </Badge>
                </div>
                <h3 className="mb-1 line-clamp-2 text-sm font-medium">
                  {notice.title}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-600">
                  {notice.description}
                </p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>目前沒有置頂公告。</p>
        </div>
      )}
    </div>
  );
}
