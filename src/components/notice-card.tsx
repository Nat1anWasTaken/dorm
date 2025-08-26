import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: "events" | "announcements" | "maintenance";
  image?: string;
  isPinned?: boolean;
  createdAt: string;
}

interface NoticeCardProps {
  notice: Notice;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const getCategoryColor = (category: Notice["category"]) => {
    switch (category) {
      case "events":
        return "bg-green-100 text-green-800";
      case "announcements":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="aspect-[4/3] relative bg-gray-100">
        {notice.image ? (
          <Image
            src={notice.image}
            alt={notice.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-gray-500">📋</span>
            </div>
          </div>
        )}
        {notice.isPinned && (
          <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
            Pinned
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(notice.category)}>
            {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{notice.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{notice.description}</p>
      </CardContent>
    </Card>
  );
}