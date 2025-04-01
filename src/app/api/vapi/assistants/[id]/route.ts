import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agent = await db.agent.findUnique({
      where: { 
        id: params.id,
        userId 
      },
      include: {
        knowledgeBases: true,
        phoneNumbers: true,
        tools: {
          include: {
            tool: true
          }
        },
        prompts: true,
        callLogs: {
          take: 10,
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json({ 
      error: "Failed to fetch agent" 
    }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      name, 
      description, 
      voiceId, 
      languageModel,
      isActive,
      personality,
      industry,
      knowledgeBaseIds
    } = await req.json()

    // Update the agent in our database
    const agent = await db.agent.update({
      where: { 
        id: params.id,
        userId
      },
      data: {
        name,
        description,
        voiceId,
        languageModel,
        isActive,
        personality,
        industry
      }
    })

    // Update knowledge base connections if provided
    if (knowledgeBaseIds) {
      // First, disconnect all existing knowledge bases
      await db.agent.update({
        where: { id: params.id },
        data: {
          knowledgeBases: {
            set: []
          }
        }
      })

      // Then, connect the new ones
      if (knowledgeBaseIds.length > 0) {
        await db.agent.update({
          where: { id: params.id },
          data: {
            knowledgeBases: {
              connect: knowledgeBaseIds.map((id: string) => ({ id }))
            }
          }
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      agent
    })
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json({ 
      error: "Failed to update agent",
      details: error
    }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agent = await db.agent.findUnique({
      where: { 
        id: params.id,
        userId 
      }
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Delete the agent from our database
    await db.agent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true 
    })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json({ 
      error: "Failed to delete agent" 
    }, { status: 500 })
  }
} 