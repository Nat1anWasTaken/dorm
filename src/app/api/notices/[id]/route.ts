import { NextRequest, NextResponse } from "next/server";
import { NoticeUpdateSchema } from "@/schemas/notice";
import type { NoticeResponse } from "@/types/notice";
import { getNoticeById, updateNotice, deleteNotice } from "@/lib/firebase/notices";
import { verifyAdminPermissions } from "@/lib/firebase/auth-server";

// GET /api/notices/[id] - Get specific notice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch notice from Firestore
    const notice = await getNoticeById(id);
    
    if (!notice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ notice });
  } catch (error) {
    console.error("Error fetching notice:", error);
    return NextResponse.json(
      { error: "Failed to fetch notice" },
      { status: 500 }
    );
  }
}

// PUT /api/notices/[id] - Update notice (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin permissions
    const adminAuth = await verifyAdminPermissions(request);
    if (!adminAuth) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    // Check if notice exists
    const existingNotice = await getNoticeById(id);
    if (!existingNotice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = NoticeUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    // Update notice in Firestore
    await updateNotice(id, validationResult.data);

    // Fetch updated notice
    const updatedNotice = await getNoticeById(id);

    const response: NoticeResponse = {
      notice: updatedNotice!,
      message: "Notice updated successfully"
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { error: "Failed to update notice" },
      { status: 500 }
    );
  }
}

// DELETE /api/notices/[id] - Delete notice (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin permissions
    const adminAuth = await verifyAdminPermissions(request);
    if (!adminAuth) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if notice exists
    const existingNotice = await getNoticeById(id);
    if (!existingNotice) {
      return NextResponse.json(
        { error: "Notice not found" },
        { status: 404 }
      );
    }

    // Delete notice from Firestore
    await deleteNotice(id);

    return NextResponse.json({
      message: "Notice deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { error: "Failed to delete notice" },
      { status: 500 }
    );
  }
}