"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAdminClaims } from "@/hooks/use-admin";
import { type Notice, type NoticeCardProps } from "@/types/notice";
import { Edit, Pin, PinOff, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import DeleteNoticeDialog from "@/components/notices/delete-notice-dialog";

export function NoticeCard({
  notice,
  showAdminControls = true,
  onEdit,
  onDelete,
  onTogglePin,
}: NoticeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isAdmin } = useAdminClaims();
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

  const getCategoryLabel = (category: Notice["category"]) => {
    switch (category) {
      case "events":
        return "活動";
      case "announcements":
        return "公告";
      case "maintenance":
        return "維護";
      default:
        return category;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
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
            置頂
          </Badge>
        )}
        {isAdmin && showAdminControls && (
          <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(notice);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>編輯</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin?.(notice);
                  }}
                >
                  {notice.isPinned ? (
                    <PinOff className="h-3 w-3" />
                  ) : (
                    <Pin className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {notice.isPinned ? "取消置頂" : "置頂"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>刪除</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(notice.category)}>
            {getCategoryLabel(notice.category)}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {notice.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {notice.description}
        </p>
      </CardContent>
      {isAdmin && (
        <DeleteNoticeDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="刪除公告"
          description={`你確定要刪除「${notice.title}」嗎？此動作無法復原。`}
          onConfirm={async () => {
            if (!onDelete) return;
            await onDelete(notice);
          }}
        />
      )}
    </Card>
  );
}
