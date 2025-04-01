import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { queryKnowledgeBase, generateRAGResponse } from "@/lib/documents"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, knowledgeBaseId, contextLimit } = await req.json()
    
    if (!query || !knowledgeBaseId) {
      return NextResponse.json({ 
        error: "Missing required fields: query and knowledgeBaseId are required" 
      }, { status: 400 })
    }
    
    // Verify the knowledge base belongs to the user
    const knowledgeBase = await db.knowledgeBase.findUnique({
      where: {
        id: knowledgeBaseId,
        userId
      }
    })
    
    if (!knowledgeBase) {
      return NextResponse.json({ error: "Knowledge base not found" }, { status: 404 })
    }
    
    // Case 1: Simple query to get context chunks
    if (req.headers.get("x-context-only") === "true") {
      const results = await queryKnowledgeBase({
        query,
        knowledgeBaseId,
        limit: contextLimit || 5
      })
      
      return NextResponse.json({ results })
    }
    
    // Case 2: Generate RAG response with context
    const response = await generateRAGResponse({
      query,
      knowledgeBaseId,
      contextLimit: contextLimit || 5
    })
    
    // Log the query for analytics using the KnowledgeQuery model
    await db.knowledgeQuery.create({
      data: {
        query,
        knowledgeBaseId,
        userId,
        response: response.response,
        sources: response.sources
      }
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error querying knowledge base:", error)
    return NextResponse.json({ 
      error: "Failed to query knowledge base",
      details: error
    }, { status: 500 })
  }
} 