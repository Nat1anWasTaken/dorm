"use client";

import { NoticeEditor } from "@/components/admin/notice-editor";
import { NoticeCard } from "@/components/notices/notice-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { noticesKeys } from "@/hooks/use-notices";
import * as noticeApi from "@/lib/api/notices";
import { type CreateNoticeRequest, type Notice } from "@/types/notice";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type NoticeFormMode = "create" | "edit";

export interface NoticeFormProps {
  mode?: NoticeFormMode;
  initialNotice?: Partial<Notice>;
}

export function NoticeForm({
  mode = "create",
  initialNotice,
}: NoticeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(initialNotice?.title || "");
  const [description, setDescription] = useState(
    initialNotice?.description || ""
  );
  const [content, setContent] = useState(initialNotice?.content || "");
  const [category, setCategory] = useState<Notice["category"]>(
    (initialNotice?.category as Notice["category"]) || "announcements"
  );
  const [isPinned, setIsPinned] = useState<boolean>(
    Boolean(initialNotice?.isPinned)
  );
  const [imageUrl, setImageUrl] = useState<string>(initialNotice?.image || "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialNotice?.image || null
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const previewNotice: Notice = useMemo(
    () => ({
      id: initialNotice?.id || "preview",
      title: title || "未命名公告",
      description: description || "簡短描述會顯示在此。",
      content: content || "",
      category,
      image: imagePreview || undefined,
      isPinned,
      createdAt:
        initialNotice?.createdAt || new Date().toISOString().split("T")[0],
    }),
    [
      title,
      description,
      content,
      category,
      imagePreview,
      isPinned,
      initialNotice?.id,
      initialNotice?.createdAt,
    ]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error("請填寫標題、摘要與內容");
      return;
    }

    setSubmitting(true);
    try {
      const finalImage = imageUrl.trim();

      const payload: CreateNoticeRequest = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category,
        image: finalImage || undefined,
        isPinned,
      };

      if (mode === "edit" && initialNotice?.id) {
        await noticeApi.updateNotice(initialNotice.id, payload);
        await queryClient.invalidateQueries({ queryKey: noticesKeys.all });
        await queryClient.invalidateQueries({
          queryKey: noticesKeys.detail(initialNotice.id),
        });
        toast.success("已更新公告");
      } else {
        await noticeApi.createNotice(payload);
        await queryClient.invalidateQueries({ queryKey: noticesKeys.all });
        toast.success("已建立公告");
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "儲存公告失敗");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">標題</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：21 日停水維護"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">摘要</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="一到兩句簡短說明"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">類別</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as Notice["category"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="請選擇類別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcements">公告</SelectItem>
                <SelectItem value="events">活動</SelectItem>
                <SelectItem value="maintenance">維護</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pinned">置頂</Label>
            <div className="flex items-center gap-3 py-2">
              <input
                id="pinned"
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span className="text-sm text-gray-600">
                顯示在公告欄頂端
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>圖片</Label>
          <div className="flex items-center gap-3">
            <Input
              type="url"
              placeholder="圖片網址"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imagePreview && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setImagePreview(null);
                  setImageUrl("");
                }}
              >
                移除
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>內容（支援 Markdown）</Label>
          <NoticeEditor content={content} onChange={setContent} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {mode === "edit" ? "更新公告" : "建立公告"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => router.back()}
          >
            取消
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-2">即時預覽</div>
            <NoticeCard notice={previewNotice} showAdminControls={false} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
