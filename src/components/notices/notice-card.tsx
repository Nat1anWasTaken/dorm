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
import Link from "next/link";
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
    <Link href={`/notices/${notice.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-gray-100">
        {notice.image ? (
          <Image
            src={notice.image}
            alt={notice.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-300">
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
          <div className="absolute top-3 left-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 bg-white/90 p-0 hover:bg-white"
                  onClick={e => {
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
                  className="h-8 w-8 bg-white/90 p-0 hover:bg-white"
                  onClick={e => {
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
                  onClick={e => {
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
        <div className="mb-2 flex items-center justify-between">
          <Badge className={getCategoryColor(notice.category)}>
            {getCategoryLabel(notice.category)}
          </Badge>
        </div>
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
          {notice.title}
        </h3>
        <p className="line-clamp-3 text-sm text-gray-600">
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
    </Link>
  );
}
