/**
 * Client functions for notice management using Firebase directly
 */

import { 
  type Notice, 
  type CreateNoticeRequest, 
  type NoticeResponse,
  type NoticesListResponse 
} from "@/types/notice";
import * as noticeService from "@/lib/firebase/notices";

/**
 * Fetch all notices with optional filtering
 */
export async function fetchNotices(params?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  pinned?: boolean;
}): Promise<NoticesListResponse> {
  try {
    const result = await noticeService.getNotices(params);
    return result;
  } catch (error) {
    console.error("Error fetching notices:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to fetch notices");
  }
}

/**
 * Fetch a specific notice by ID
 */
export async function fetchNotice(id: string): Promise<NoticeResponse> {
  try {
    const notice = await noticeService.getNoticeById(id);
    if (!notice) {
      throw new Error("Notice not found");
    }
    return { notice };
  } catch (error) {
    console.error("Error fetching notice:", error);
    // Fallback to sample data when Firestore isn't available (local dev)
    try {
      const { sampleNotices } = await import("@/lib/data/sample-notices");
      const fallback = sampleNotices.find((n) => n.id === id);
      if (fallback) {
        return { notice: fallback };
      }
    } catch {}
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch notice"
    );
  }
}

/**
 * Create a new notice (handled by Firebase Security Rules)
 */
export async function createNotice(data: CreateNoticeRequest): Promise<NoticeResponse> {
  try {
    const noticeData = {
      ...data,
      createdAt: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    };
    
    const notice = await noticeService.createNotice(noticeData);
    return { 
      notice,
      message: "Notice created successfully" 
    };
  } catch (error) {
    console.error("Error creating notice:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create notice");
  }
}

/**
 * Update a notice (handled by Firebase Security Rules)
 */
export async function updateNotice(id: string, data: Partial<CreateNoticeRequest>): Promise<NoticeResponse> {
  try {
    await noticeService.updateNotice(id, data);
    const notice = await noticeService.getNoticeById(id);
    
    if (!notice) {
      throw new Error("Notice not found after update");
    }
    
    return { 
      notice,
      message: "Notice updated successfully" 
    };
  } catch (error) {
    console.error("Error updating notice:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update notice");
  }
}

/**
 * Delete a notice (handled by Firebase Security Rules)
 */
export async function deleteNotice(id: string): Promise<{ message: string }> {
  try {
    await noticeService.deleteNotice(id);
    return { message: "Notice deleted successfully" };
  } catch (error) {
    console.error("Error deleting notice:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete notice");
  }
}

/**
 * Toggle pin status of a notice
 */
export async function toggleNoticePin(notice: Notice): Promise<NoticeResponse> {
  return updateNotice(notice.id, { isPinned: !notice.isPinned });
}
