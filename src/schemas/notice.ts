import { z } from "zod";

// Base notice category enum
export const NoticeCategory = z.enum(["events", "announcements", "maintenance"]);

// Core notice schema
export const NoticeSchema = z.object({
  id: z.string().min(1, "需要提供 ID"),
  title: z.string().min(1, "需要提供標題").max(200, "標題長度須少於 200 個字元"),
  description: z.string().min(1, "需要提供摘要").max(1000, "摘要長度須少於 1000 個字元"),
  content: z.string().min(1, "需要提供內容"), // Stored as plain text, rendered as markdown
  category: NoticeCategory,
  image: z.string().url("圖片網址無效").optional(),
  isPinned: z.boolean().default(false),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式無效（YYYY-MM-DD）"),
});

// Schema for creating a new notice
export const NoticeCreateSchema = NoticeSchema.omit({
  id: true,
  createdAt: true,
}).extend({
  isPinned: z.boolean().optional().default(false),
});

// Schema for updating a notice
export const NoticeUpdateSchema = NoticeCreateSchema.partial();

// Schema for API responses
export const NoticesResponseSchema = z.object({
  notices: z.array(NoticeSchema),
  total: z.number().int().min(0),
});

export const NoticeResponseSchema = z.object({
  notice: NoticeSchema,
  message: z.string().optional(),
});

// Schema for query parameters
export const NoticeQuerySchema = z.object({
  category: z.preprocess(
    (val) => val === "" || val === null ? undefined : val,
    NoticeCategory.optional()
  ),
  search: z.preprocess(
    (val) => val === "" || val === null ? undefined : val,
    z.string().max(100).optional()
  ),
  limit: z.preprocess(
    (val) => val === "" || val === null ? 20 : val,
    z.coerce.number().int().min(1).max(100).default(20)
  ),
  offset: z.preprocess(
    (val) => val === "" || val === null ? 0 : val,
    z.coerce.number().int().min(0).default(0)
  ),
  pinned: z.preprocess(
    (val) => val === "" || val === null ? undefined : val,
    z.coerce.boolean().optional()
  ),
});

// Type exports
export type Notice = z.infer<typeof NoticeSchema>;
export type NoticeCreateInput = z.infer<typeof NoticeCreateSchema>;
export type NoticeUpdateInput = z.infer<typeof NoticeUpdateSchema>;
export type NoticesResponse = z.infer<typeof NoticesResponseSchema>;
export type NoticeResponse = z.infer<typeof NoticeResponseSchema>;
export type NoticeQuery = z.infer<typeof NoticeQuerySchema>;
export type NoticeCategoryType = z.infer<typeof NoticeCategory>;
