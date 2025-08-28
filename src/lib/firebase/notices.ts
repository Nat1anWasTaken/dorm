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
  limit
} from "firebase/firestore";
import { db } from "./server";
import { type Notice } from "@/types/notice";

const NOTICES_COLLECTION = "notices";

/**
 * Convert Firestore document to Notice type
 */
function docToNotice(doc: { id: string; data: () => Record<string, unknown> }): Notice {
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
        filteredNotices = filteredNotices.filter(notice => notice.category === params.category);
      }
      
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredNotices = filteredNotices.filter(notice =>
          notice.title.toLowerCase().includes(searchTerm) ||
          notice.description.toLowerCase().includes(searchTerm) ||
          notice.content.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params?.pinned !== undefined) {
        filteredNotices = filteredNotices.filter(notice => notice.isPinned === params.pinned);
      }
      
      // Apply offset and limit
      const offset = params?.offset || 0;
      const limit = params?.limit || 20;
      const paginatedNotices = filteredNotices.slice(offset, offset + limit);
      
      return {
        notices: paginatedNotices,
        total: filteredNotices.length
      };
    }
    
    if (!db) {
      throw new Error("Firebase not initialized");
    }
    const noticesRef = collection(db, NOTICES_COLLECTION);
    console.log("Collection reference created:", noticesRef ? "✅ Success" : "❌ Failed");
    let noticeQuery = query(noticesRef, orderBy("createdAt", "desc"));

    // Apply filters
    if (params?.category) {
      noticeQuery = query(noticeQuery, where("category", "==", params.category));
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
      notices = notices.filter(notice =>
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
      total: notices.length
    };
  } catch (error) {
    console.error("Error fetching notices:", error);
    // Re-throw the original error to preserve Firebase error information
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch notices from Firestore");
  }
}

/**
 * Fetch a single notice by ID
 */
export async function getNoticeById(id: string): Promise<Notice | null> {
  try {
    if (!db) {
      throw new Error("Firebase not initialized");
    }
    const docRef = doc(db, NOTICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docToNotice(docSnap);
  } catch (error) {
    console.error("Error fetching notice:", error);
    throw new Error("Failed to fetch notice from Firestore");
  }
}

/**
 * Create a new notice
 */
export async function createNotice(noticeData: Omit<Notice, "id">): Promise<Notice> {
  try {
    if (!db) {
      throw new Error("Firebase not initialized");
    }
    const docRef = await addDoc(collection(db, NOTICES_COLLECTION), {
      title: noticeData.title,
      description: noticeData.description,
      content: noticeData.content,
      category: noticeData.category,
      image: noticeData.image,
      isPinned: noticeData.isPinned || false,
      createdAt: noticeData.createdAt,
    });

    const newNotice: Notice = {
      id: docRef.id,
      ...noticeData,
    };

    return newNotice;
  } catch (error) {
    console.error("Error creating notice:", error);
    throw new Error("Failed to create notice in Firestore");
  }
}

/**
 * Update an existing notice
 */
export async function updateNotice(id: string, updates: Partial<Omit<Notice, "id">>): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firebase not initialized");
    }
    const docRef = doc(db, NOTICES_COLLECTION, id);
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    console.error("Error updating notice:", error);
    throw new Error("Failed to update notice in Firestore");
  }
}

/**
 * Delete a notice
 */
export async function deleteNotice(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error("Firebase not initialized");
    }
    const docRef = doc(db, NOTICES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting notice:", error);
    throw new Error("Failed to delete notice from Firestore");
  }
}

/**
 * Get pinned notices only
 */
export async function getPinnedNotices(): Promise<Notice[]> {
  const result = await getNotices({ pinned: true });
  return result.notices;
}