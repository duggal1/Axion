/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { VapiClient } from "@vapi-ai/server-sdk"
import { auth } from "@clerk/nextjs/server"

// Initialized later with user's API key
let vapiClient: VapiClient | null = null

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      name, 
      description, 
      firstMessage, 
      systemPrompt, 
      voiceId, 
      languageModel,
      knowledgeBaseIds = [],
      apiKey // User can provide their own VAPI API key
    } = await req.json()
    
    // Use user's API key or fall back to environment variable
    const apiKeyToUse = apiKey || process.env.VAPI_API_KEY
    
    if (!apiKeyToUse) {
      return NextResponse.json({ 
        error: "No API key provided. Please provide your Vapi API key." 
      }, { status: 400 })
    }
    
    // Initialize Vapi client with the appropriate API key
    vapiClient = new VapiClient({
      token: apiKeyToUse
    })

    // Create the assistant using the Vapi SDK
    // We use conditional types to handle different model providers
    let assistantData: any = {
      name,
      firstMessage,
      transcriber: { provider: "deepgram" }
    }
    
    // Configure the voice
    assistantData.voice = {
      provider: "11labs",
      voiceId: voiceId || "EXAVITQu4vr4xnSDxMaL"
    }
    
    // Configure the model based on provider
    if (languageModel === "gemini") {
      assistantData.model = {
        provider: "google",
        model: "gemini-1.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ]
      }
    } else {
      assistantData.model = {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ]
      }
    }
    
    const assistant = await vapiClient.assistants.create(assistantData)

    // Store the assistant in our database
    // First create the agent record
    const agent = await db.agent.create({
      data: {
        name,
        description,
        userId,
        avatar: null,
        voiceId,
        languageModel,
        isActive: true,
        personality: {},
        industry: null
      }
    })
    
    // Then update it with the Vapi assistant ID
    const dbAgent = await db.agent.update({
      where: { id: agent.id },
      data: {
        vapiAssistantId: assistant.id
      }
    })

    // Link knowledge bases to the agent
    if (knowledgeBaseIds.length > 0) {
      await db.agent.update({
        where: { id: dbAgent.id },
        data: {
          knowledgeBases: {
            connect: knowledgeBaseIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      agent: dbAgent,
      vapiAssistantId: assistant.id 
    })
  } catch (error) {
    console.error("Error creating assistant:", error)
    return NextResponse.json({ 
      error: "Failed to create assistant",
      details: error
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agents = await db.agent.findMany({
      where: { userId },
      include: {
        knowledgeBases: true,
        phoneNumbers: true,
        tools: {
          include: {
            tool: true
          }
        }
      }
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error fetching assistants:", error)
    return NextResponse.json({ 
      error: "Failed to fetch assistants" 
    }, { status: 500 })
  }
} 