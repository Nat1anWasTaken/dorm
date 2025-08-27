import { NextRequest, NextResponse } from "next/server";
import { NoticeCreateSchema, NoticeQuerySchema } from "@/schemas/notice";
import type { NoticesListResponse, NoticeResponse } from "@/types/notice";
import { getNotices, createNotice } from "@/lib/firebase/notices";
import { verifyAdminPermissions } from "@/lib/firebase/auth-server";

// GET /api/notices - Get all notices
export async function GET(request: NextRequest): Promise<NextResponse<NoticesListResponse | { error: string }>> {
  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryResult = NoticeQuerySchema.safeParse({
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
      pinned: searchParams.get("pinned"),
    });

    if (!queryResult.success) {
      console.error("Query validation failed:", queryResult.error.issues);
      return NextResponse.json(
        { 
          error: "Invalid query parameters",
          details: queryResult.error.issues
        },
        { status: 400 }
      );
    }

    const { category, search, limit, offset, pinned } = queryResult.data;

    // Fetch notices from Firestore
    const result = await getNotices({
      category,
      search,
      limit,
      offset,
      pinned
    });

    const response: NoticesListResponse = {
      notices: result.notices,
      total: result.total,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

// POST /api/notices - Create new notice (admin only)
export async function POST(request: NextRequest): Promise<NextResponse<NoticeResponse | { error: string }>> {
  try {
    // Verify admin permissions
    const adminAuth = await verifyAdminPermissions(request);
    if (!adminAuth) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = NoticeCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { title, description, content, category, image, isPinned } = validationResult.data;

    // Create notice data
    const noticeData = {
      title,
      description,
      content,
      category,
      image,
      isPinned: isPinned || false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Save to Firestore
    const newNotice = await createNotice(noticeData);

    const response: NoticeResponse = {
      notice: newNotice,
      message: "Notice created successfully"
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}
