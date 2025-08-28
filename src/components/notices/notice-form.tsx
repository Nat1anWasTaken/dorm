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
      title: title || "Untitled Notice",
      description: description || "Short description will appear here.",
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
      toast.error("Please fill in title, description, and content");
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
        toast.success("Notice updated");
      } else {
        await noticeApi.createNotice(payload);
        await queryClient.invalidateQueries({ queryKey: noticesKeys.all });
        toast.success("Notice created");
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save notice");
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Water Maintenance on 21st"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="One or two sentences summary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as Notice["category"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcements">Announcements</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pinned">Pinned</Label>
            <div className="flex items-center gap-3 py-2">
              <input
                id="pinned"
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span className="text-sm text-gray-600">
                Show at top of board
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex items-center gap-3">
            <Input
              type="url"
              placeholder="Image URL"
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
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Full Content (Markdown supported)</Label>
          <NoticeEditor content={content} onChange={setContent} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting}>
            {mode === "edit" ? "Update Notice" : "Create Notice"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-2">Live Preview</div>
            <NoticeCard notice={previewNotice} showAdminControls={false} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
