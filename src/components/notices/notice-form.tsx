"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { type CreateNoticeRequest, type Notice } from "@/types/notice";
import * as noticeApi from "@/lib/api/notices";
import { toast } from "sonner";

type NoticeFormMode = "create" | "edit";

export interface NoticeFormProps {
  mode?: NoticeFormMode;
  initialNotice?: Partial<Notice>;
}

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function NoticeForm({ mode = "create", initialNotice }: NoticeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialNotice?.title || "");
  const [description, setDescription] = useState(initialNotice?.description || "");
  const [content, setContent] = useState(initialNotice?.content || "");
  const [category, setCategory] = useState<Notice["category"]>(
    (initialNotice?.category as Notice["category"]) || "announcements"
  );
  const [isPinned, setIsPinned] = useState<boolean>(Boolean(initialNotice?.isPinned));
  const [imageUrl, setImageUrl] = useState<string>(initialNotice?.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialNotice?.image || null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      createdAt: initialNotice?.createdAt || new Date().toISOString().split("T")[0],
    }),
    [title, description, content, category, imagePreview, isPinned, initialNotice?.id, initialNotice?.createdAt]
  );

  const onPickFile = async (file?: File) => {
    if (!file) return;
    setImageFile(file);
    const dataUrl = await fileToDataURL(file);
    setImagePreview(dataUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error("Please fill in title, description, and content");
      return;
    }

    setSubmitting(true);
    try {
      let finalImage = imageUrl.trim();
      if (!finalImage && imageFile && imagePreview) {
        // Fallback: inline data URL if no upload backend
        finalImage = imagePreview;
      }

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
        toast.success("Notice updated");
      } else {
        await noticeApi.createNotice(payload);
        toast.success("Notice created");
      }

      router.push("/notice-board");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save notice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Water Maintenance on 21st" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="One or two sentences summary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as Notice["category"])}>
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
              <input id="pinned" type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
              <span className="text-sm text-gray-600">Show at top of board</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
              <Input type="url" placeholder="or paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0] || undefined)} />
              {imagePreview && (
                <Button type="button" variant="ghost" onClick={() => { setImagePreview(null); setImageFile(null); setImageUrl(""); }}>Remove</Button>
              )}
            </div>
            {imagePreview && (
              <div className="relative w-full max-w-md aspect-[4/3] rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Selected" className="object-cover w-full h-full" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Full Content (Markdown supported)</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} placeholder={"Write the full content..."} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={submitting}>{mode === "edit" ? "Update Notice" : "Create Notice"}</Button>
          <Button type="button" variant="outline" disabled={submitting} onClick={() => router.back()}>Cancel</Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 mb-2">Live Preview</div>
            {/* We inline a minimal preview to avoid admin-only buttons from NoticeCard */}
            <div className="overflow-hidden rounded-lg border">
              <div className="aspect-[4/3] relative bg-gray-100">
                {imagePreview ? (
                  <Image src={imagePreview} alt={title || "Preview"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-gray-500">📋</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 inline-block rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                <div className="font-semibold text-lg mb-2">{title || "Untitled Notice"}</div>
                <div className="text-sm text-gray-600">{description || "Short description will appear here."}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
