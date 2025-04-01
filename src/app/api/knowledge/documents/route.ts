import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { processDocument } from "@/lib/documents"
import { FileType } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      name, 
      fileUrl, 
      fileType, 
      size, 
      knowledgeBaseId 
    } = await req.json()
    
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
    
    // Create document record
    const document = await db.document.create({
      data: {
        name,
        fileUrl,
        fileType: fileType as FileType,
        size,
        knowledgeBaseId,
        processed: false
      }
    })
    
    // Start document processing
    // Note: In a production environment, this should be a background job
    processDocument(document.id).catch(error => {
      console.error("Error processing document:", error)
    })
    
    return NextResponse.json({ 
      success: true, 
      document
    })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ 
      error: "Failed to upload document",
      details: error
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const knowledgeBaseId = url.searchParams.get("knowledgeBaseId")
    
    if (!knowledgeBaseId) {
      return NextResponse.json({ error: "Knowledge base ID is required" }, { status: 400 })
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
    
    // Get documents
    const documents = await db.document.findMany({
      where: {
        knowledgeBaseId
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ 
      error: "Failed to fetch documents" 
    }, { status: 500 })
  }
} 