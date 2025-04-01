import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { queryMemory } from "@/lib/memory"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { agentId, query, limit } = await req.json()
    
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
    
    // Query the memory
    const results = await queryMemory({
      agentId,
      userId,
      query,
      limit
    })
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error querying memory:", error)
    return NextResponse.json({ 
      error: "Failed to query memory",
      details: error
    }, { status: 500 })
  }
} 