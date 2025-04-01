import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { callId: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const callId = params.callId;
    const { status, endTime, duration, transcriptUrl } = await req.json();
    
    // Find the call and verify ownership
    const existingCall = await db.callLog.findFirst({
      where: {
        id: callId,
        userId,
      },
    });
    
    if (!existingCall) {
      return NextResponse.json(
        { error: "Call record not found" },
        { status: 404 }
      );
    }
    
    // Update the call record
    const updatedCall = await db.callLog.update({
      where: {
        id: callId,
      },
      data: {
        status: status || undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        duration: duration || undefined,
        transcriptUrl: transcriptUrl || undefined,
      },
    });
    
    return NextResponse.json({ call: updatedCall });
  } catch (error) {
    console.error("Error updating call record:", error);
    return NextResponse.json(
      { error: "Failed to update call record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { callId: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const callId = params.callId;
    
    // Find the call and verify ownership
    const existingCall = await db.callLog.findFirst({
      where: {
        id: callId,
        userId,
      },
    });
    
    if (!existingCall) {
      return NextResponse.json(
        { error: "Call record not found" },
        { status: 404 }
      );
    }
    
    // Delete the call record
    await db.callLog.delete({
      where: {
        id: callId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting call record:", error);
    return NextResponse.json(
      { error: "Failed to delete call record" },
      { status: 500 }
    );
  }
} 