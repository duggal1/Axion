import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { createVapiCall, getVapiCallStatus, endVapiCall } from "@/lib/vapi"
import { CallStatus } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      agentId, 
      phoneNumber, 
      transcript, 
      status, 
      duration,
      callSid 
    } = await req.json()
    
    // Case 1: Create a new call
    if (phoneNumber) {
      // Verify the agent belongs to the user
      const agent = await db.agent.findUnique({
        where: { 
          id: agentId,
          userId 
        }
      })
      
      if (!agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 })
      }
      
      if (!agent.vapiAssistantId) {
        return NextResponse.json({ error: "Agent has no Vapi assistant ID" }, { status: 400 })
      }
      
      // Create the call in Vapi
      const vapiCall = await createVapiCall({
        vapiAssistantId: agent.vapiAssistantId,
        phoneNumber,
        agentId,
        userId
      })
      
      return NextResponse.json({ 
        success: true, 
        callId: vapiCall.id 
      })
    }
    
    // Case 2: Log call transcript and update call status
    if (transcript && agentId) {
      // Find the call log by SID if provided, otherwise create a new entry
      let callLog
      
      if (callSid) {
        callLog = await db.callLog.findFirst({
          where: {
            callSid,
            agentId
          }
        })
        
        if (callLog) {
          callLog = await db.callLog.update({
            where: { id: callLog.id },
            data: {
              transcriptUrl: transcript,
              status: status as CallStatus,
              duration: duration || callLog.duration
            }
          })
        }
      }
      
      // If no call log found, create a new one
      if (!callLog) {
        callLog = await db.callLog.create({
          data: {
            agentId,
            userId,
            transcriptUrl: transcript,
            status: status as CallStatus,
            duration,
            direction: "inbound"
          }
        })
      }
      
      return NextResponse.json({ 
        success: true, 
        callLog 
      })
    }
    
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error handling call:", error)
    return NextResponse.json({ 
      error: "Failed to handle call",
      details: error
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId");
    const status = url.searchParams.get("status");
    
    let query = { userId };
    
    if (agentId) {
      query = {
        ...query,
        agentId,
      };
    }
    
    if (status) {
      query = {
        ...query,
        status,
      };
    }
    
    const calls = await db.callLog.findMany({
      where: query,
      orderBy: {
        startTime: "desc",
      },
    });
    
    return NextResponse.json({ calls });
  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const callId = url.searchParams.get("callId")
    
    if (!callId) {
      return NextResponse.json({ error: "Call ID is required" }, { status: 400 })
    }
    
    // End the call in Vapi
    await endVapiCall(callId)
    
    // Update call status in database
    await db.callLog.updateMany({
      where: { 
        callSid: callId,
        userId
      },
      data: {
        status: "completed"
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error ending call:", error)
    return NextResponse.json({ 
      error: "Failed to end call",
      details: error
    }, { status: 500 })
  }
} 