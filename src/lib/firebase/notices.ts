/**
 * Firestore service for notice operations
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "./client";
import { type Notice } from "@/types/notice";

const NOTICES_COLLECTION = "notices";

/**
 * Convert Firestore document to Notice type
 */
function docToNotice(doc: {
  id: string;
  data: () => Record<string, unknown>;
}): Notice {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    description: data.description as string,
    content: data.content as string,
    category: data.category as Notice["category"],
    image: data.image as string | undefined,
    isPinned: (data.isPinned as boolean) || false,
    createdAt: data.createdAt as string,
  };
}

/**
 * Fetch all notices with optional filtering and pagination
 */
export async function getNotices(params?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  pinned?: boolean;
}): Promise<{ notices: Notice[]; total: number }> {
  try {
    console.log("Getting notices with params:", params);
    console.log("DB instance:", db ? "✅ Available" : "❌ Missing");

    // Fallback to sample data if Firebase is not configured
    if (!db) {
      console.warn("⚠️ Firestore not configured, using sample data");
      const { sampleNotices } = await import("@/lib/data/sample-notices");

      let filteredNotices = [...sampleNotices];

      // Apply filters (similar to client-side filtering)
      if (params?.category) {
        filteredNotices = filteredNotices.filter(
          notice => notice.category === params.category
        );
      }

      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredNotices = filteredNotices.filter(
          notice =>
            notice.title.toLowerCase().includes(searchTerm) ||
            notice.description.toLowerCase().includes(searchTerm) ||
            notice.content.toLowerCase().includes(searchTerm)
        );
      }

      if (params?.pinned !== undefined) {
        filteredNotices = filteredNotices.filter(
          notice => notice.isPinned === params.pinned
        );
      }

      // Apply offset and limit
      const offset = params?.offset || 0;
      const limit = params?.limit || 20;
      const paginatedNotices = filteredNotices.slice(offset, offset + limit);

      return {
        notices: paginatedNotices,
        total: filteredNotices.length,
      };
    }

    if (!db) {
      throw new Error("Firebase 未初始化");
    }
    const noticesRef = collection(db, NOTICES_COLLECTION);
    console.log(
      "Collection reference created:",
      noticesRef ? "✅ Success" : "❌ Failed"
    );
    let noticeQuery = query(noticesRef, orderBy("createdAt", "desc"));

    // Apply filters
    if (params?.category) {
      noticeQuery = query(
        noticeQuery,
        where("category", "==", params.category)
      );
    }

    if (params?.pinned !== undefined) {
      noticeQuery = query(noticeQuery, where("isPinned", "==", params.pinned));
    }

    // Apply pagination
    if (params?.limit) {
      noticeQuery = query(noticeQuery, limit(params.limit));
    }

    const snapshot = await getDocs(noticeQuery);
    let notices = snapshot.docs.map(docToNotice);

    // Apply text search filter (client-side since Firestore doesn't have full-text search)
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      notices = notices.filter(
        notice =>
          notice.title.toLowerCase().includes(searchTerm) ||
          notice.description.toLowerCase().includes(searchTerm) ||
          notice.content.toLowerCase().includes(searchTerm)
      );
    }

    // Apply offset (client-side for simplicity)
    if (params?.offset) {
      notices = notices.slice(params.offset);
    }

    return {
      notices,
      total: notices.length,
    };
  } catch (error) {
    console.error("Error fetching notices:", error);
    // Re-throw the original error to preserve Firebase error information
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("從 Firestore 讀取公告失敗");
  }
}

/**
 * Fetch a single notice by ID
 */
export async function getNoticeById(id: string): Promise<Notice | null> {
  try {
    if (!db) {
      throw new Error("Firebase 未初始化");
    }
    const docRef = doc(db, NOTICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docToNotice(docSnap);
  } catch (error) {
    console.error("Error fetching notice:", error);
    throw new Error("從 Firestore 讀取公告失敗");
  }
}

/**
 * Create a new notice
 */
export async function createNotice(
  noticeData: Omit<Notice, "id">
): Promise<Notice> {
  try {
    if (!db) {
      throw new Error("Firebase 未初始化");
    }
    // Build payload and omit undefined fields (Firestore rejects undefined values)
    const basePayload = {
      title: noticeData.title,
      description: noticeData.description,
      content: noticeData.content,
      category: noticeData.category,
      image: noticeData.image,
      isPinned: noticeData.isPinned || false,
      createdAt: noticeData.createdAt,
    } as const;
    const cleanPayload = Object.fromEntries(
      Object.entries(basePayload).filter(([, v]) => v !== undefined)
    );

    const docRef = await addDoc(
      collection(db, NOTICES_COLLECTION),
      cleanPayload
    );

    const newNotice: Notice = {
      id: docRef.id,
      ...noticeData,
    };

    return newNotice;
  } catch (error) {
    console.error("Error creating notice:", error);
    throw new Error("在 Firestore 建立公告失敗");
  }
}

/**
 * Update an existing notice
 */
export async function updateNotice(
  id: string,
  updates: Partial<Omit<Notice, "id">>
): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firebase 未初始化");
    }
    const docRef = doc(db, NOTICES_COLLECTION, id);

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    console.error("Error updating notice:", error);
    throw new Error("在 Firestore 更新公告失敗");
  }
}

/**
 * Delete a notice
 */
export async function deleteNotice(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firebase 未初始化");
    }
    const docRef = doc(db, NOTICES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting notice:", error);
    throw new Error("從 Firestore 刪除公告失敗");
  }
}

/**
 * Get pinned notices only
 */
export async function getPinnedNotices(): Promise<Notice[]> {
  const result = await getNotices({ pinned: true });
  return result.notices;
}

/**
 * Fetch notices for infinite scrolling with cursor-based pagination
 */
export async function getNoticesInfinite(params?: {
  category?: string;
  search?: string;
  limit?: number;
  lastNoticeId?: string;
  pinned?: boolean;
}): Promise<{ notices: Notice[]; total: number; nextCursor?: string }> {
  try {
    console.log("Getting infinite notices with params:", params);

    // Fallback to sample data if Firebase is not configured
    if (!db) {
      console.warn("⚠️ Firestore not configured, using sample data");
      const { sampleNotices } = await import("@/lib/data/sample-notices");

      let filteredNotices = [...sampleNotices];

      // Apply filters
      if (params?.category) {
        filteredNotices = filteredNotices.filter(
          notice => notice.category === params.category
        );
      }

      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredNotices = filteredNotices.filter(
          notice =>
            notice.title.toLowerCase().includes(searchTerm) ||
            notice.description.toLowerCase().includes(searchTerm) ||
            notice.content.toLowerCase().includes(searchTerm)
        );
      }

      if (params?.pinned !== undefined) {
        filteredNotices = filteredNotices.filter(
          notice => notice.isPinned === params.pinned
        );
      }

      // Find the start index based on lastNoticeId
      let startIndex = 0;
      if (params?.lastNoticeId) {
        const lastIndex = filteredNotices.findIndex(
          notice => notice.id === params.lastNoticeId
        );
        startIndex = lastIndex >= 0 ? lastIndex + 1 : 0;
      }

      // Apply limit
      const pageSize = params?.limit || 10;
      const paginatedNotices = filteredNotices.slice(
        startIndex,
        startIndex + pageSize
      );

      // Determine next cursor
      const nextCursor =
        startIndex + pageSize < filteredNotices.length
          ? paginatedNotices[paginatedNotices.length - 1]?.id
          : undefined;

      return {
        notices: paginatedNotices,
        total: filteredNotices.length,
        nextCursor,
      };
    }

    const noticesRef = collection(db, NOTICES_COLLECTION);
    let noticeQuery = query(noticesRef, orderBy("createdAt", "desc"));

    // Apply filters
    if (params?.category) {
      noticeQuery = query(
        noticeQuery,
        where("category", "==", params.category)
      );
    }

    if (params?.pinned !== undefined) {
      noticeQuery = query(noticeQuery, where("isPinned", "==", params.pinned));
    }

    // Apply cursor-based pagination
    if (params?.lastNoticeId) {
      const lastDoc = await getDoc(
        doc(db, NOTICES_COLLECTION, params.lastNoticeId)
      );
      if (lastDoc.exists()) {
        noticeQuery = query(noticeQuery, startAfter(lastDoc));
      }
    }

    // Apply limit
    const pageSize = params?.limit || 10;
    noticeQuery = query(noticeQuery, limit(pageSize + 1)); // Get one extra to check for next page

    const snapshot = await getDocs(noticeQuery);
    let notices = snapshot.docs.map(docToNotice);

    // Apply text search filter (client-side)
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      notices = notices.filter(
        notice =>
          notice.title.toLowerCase().includes(searchTerm) ||
          notice.description.toLowerCase().includes(searchTerm) ||
          notice.content.toLowerCase().includes(searchTerm)
      );
    }

    // Check if there are more pages
    const hasNextPage = notices.length > pageSize;
    if (hasNextPage) {
      notices = notices.slice(0, pageSize); // Remove the extra item
    }

    // Set next cursor
    const nextCursor = hasNextPage
      ? notices[notices.length - 1]?.id
      : undefined;

    return {
      notices,
      total: notices.length,
      nextCursor,
    };
  } catch (error) {
    console.error("Error fetching infinite notices:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("從 Firestore 讀取公告失敗");
  }
}
