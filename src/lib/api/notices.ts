/**
 * API client functions for notice management
 */

import { 
  type Notice, 
  type CreateNoticeRequest, 
  type NoticeResponse,
  type NoticesListResponse 
} from "@/types/notice";
import { getAuthHeader } from "@/lib/firebase/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
  const searchParams = new URLSearchParams();
  
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());
  if (params?.pinned !== undefined) searchParams.set('pinned', params.pinned.toString());
  
  const url = `${API_BASE_URL}/api/notices${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error("API Error:", errorData);
    throw new Error(errorData.error || `Failed to fetch notices: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a specific notice by ID
 */
export async function fetchNotice(id: string): Promise<NoticeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/notices/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch notice: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Create a new notice (admin only)
 */
export async function createNotice(data: CreateNoticeRequest): Promise<NoticeResponse> {
  const authHeaders = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/notices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create notice: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Update a notice (admin only)
 */
export async function updateNotice(id: string, data: Partial<CreateNoticeRequest>): Promise<NoticeResponse> {
  const authHeaders = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update notice: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Delete a notice (admin only)
 */
export async function deleteNotice(id: string): Promise<{ message: string }> {
  const authHeaders = await getAuthHeader();
  
  const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to delete notice: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Toggle pin status of a notice (admin only)
 */
export async function toggleNoticePin(notice: Notice): Promise<NoticeResponse> {
  return updateNotice(notice.id, { isPinned: !notice.isPinned });
}