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
        {notices.map((notice) => (
          <Card key={notice.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex">
              <div className="w-20 h-20 relative bg-gray-100 flex-shrink-0">
                {notice.image ? (
                  <Image
                    src={notice.image}
                    alt={notice.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-lg text-gray-500">📋</span>
                  </div>
                )}
              </div>
              <CardContent className="flex-1 p-3">
                <div className="flex items-start justify-between mb-1">
                  <Badge variant="secondary" className="text-xs">
                    置頂
                  </Badge>
                </div>
                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                  {notice.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {notice.description}
                </p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      
      {notices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>目前沒有置頂公告。</p>
        </div>
      )}
    </div>
  );
}
