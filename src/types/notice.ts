/**
 * Notice type definitions
 */

export interface Notice {
  id: string;
  title: string;
  description: string;
  content: string; // Plain text content, will be parsed as markdown when rendering
  category: "events" | "announcements" | "maintenance";
  image?: string;
  isPinned?: boolean;
  createdAt: string;
}

export interface NoticeCardProps {
  notice: Notice;
  showAdminControls?: boolean;
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
  onTogglePin?: (notice: Notice) => void;
}

export interface CreateNoticeRequest {
  title: string;
  description: string;
  content: string;
  category: Notice["category"];
  image?: string;
  isPinned?: boolean;
}

export interface NoticeResponse {
  notice: Notice;
  message?: string;
}

export interface NoticesListResponse {
  notices: Notice[];
  total: number;
}
