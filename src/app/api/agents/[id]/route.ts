import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { getVapiAssistant } from "@/lib/vapi";

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const agentId = params.id;
    
    // Find the agent
    const agent = await db.agent.findUnique({
      where: {
        id: agentId,
        userId,
      },
      include: {
        knowledgeBases: {
          select: {
            id: true,
            name: true,
            documentCount: true,
          }
        }
      }
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }
    
    // Get call statistics
    const callStats = await db.callLog.groupBy({
      by: ["status"],
      where: {
        agentId,
      },
      _count: true,
    });
    
    const totalCalls = callStats.reduce((acc, curr) => acc + curr._count, 0);
    const activeCalls = callStats.find(s => s.status === "active")?._count || 0;
    
    // Get most recent calls
    const recentCalls = await db.callLog.findMany({
      where: {
        agentId,
      },
      orderBy: {
        startTime: "desc",
      },
      take: 5,
    });
    
    // If the agent has a Vapi assistant ID, get additional details
    let vapiAssistant = null;
    if (agent.vapiAssistantId) {
      try {
        vapiAssistant = await getVapiAssistant(agent.vapiAssistantId);
      } catch (error) {
        console.error("Error fetching Vapi assistant:", error);
        // Continue without Vapi details
      }
    }
    
    return NextResponse.json({
      agent,
      stats: {
        totalCalls,
        activeCalls,
        completedCalls: totalCalls - activeCalls,
      },
      recentCalls,
      vapiAssistant,
    });
  } catch (error) {
    console.error("Error fetching agent details:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const agentId = params.id;
    const updateData = await req.json();
    
    // Find the agent to verify ownership
    const agent = await db.agent.findUnique({
      where: {
        id: agentId,
        userId,
      },
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }
    
    // Update the agent
    const updatedAgent = await db.agent.update({
      where: {
        id: agentId,
      },
      data: updateData,
    });
    
    return NextResponse.json({ agent: updatedAgent });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const agentId = params.id;
    
    // Find the agent to verify ownership
    const agent = await db.agent.findUnique({
      where: {
        id: agentId,
        userId,
      },
    });
    
    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }
    
    // Delete all related call logs first
    await db.callLog.deleteMany({
      where: {
        agentId,
      },
    });
    
    // Delete the agent
    await db.agent.delete({
      where: {
        id: agentId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
} 