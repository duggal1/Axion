import { NextRequest, NextResponse } from "next/server"
import { saveToMemory } from "@/lib/memory"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { userId } =  await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { agentId, content, metadata } = await req.json()
    
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
    
    // Save the memory
    const result = await saveToMemory({
      agentId,
      userId,
      content,
      metadata
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error saving to memory:", error)
    return NextResponse.json({ 
      error: "Failed to save memory",
      details: error
    }, { status: 500 })
  }
} 