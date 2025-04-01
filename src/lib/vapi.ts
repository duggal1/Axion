import { VapiClient } from '@vapi-ai/server-sdk'
import { db } from '@/lib/db'
import { queryMemory, saveToMemory } from '@/lib/memory'
import { queryKnowledgeBase } from '@/lib/documents'
import type { Agent } from '@prisma/client'

// Initialize the Vapi client
const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY!
})

/**
 * Get an existing Vapi assistant by ID
 */
export async function getVapiAssistant(vapiAssistantId: string) {
  return vapi.assistants.retrieve(vapiAssistantId)
}

/**
 * Create a new Vapi assistant
 */
export async function createVapiAssistant({
  name,
  firstMessage,
  systemPrompt,
  voiceId,
  languageModel,
  agentId,
  userId
}: {
  name: string
  firstMessage: string
  systemPrompt: string
  voiceId: string
  languageModel: string
  agentId: string
  userId: string
}) {
  try {
    // Create the assistant in Vapi
    const assistant = await vapi.assistants.create({
      name,
      firstMessage,
      transcriber: { 
        provider: "deepgram", 
        model: "nova-2", 
        language: "en-US" 
      },
      voice: { 
        provider: "elevenlabs", 
        voiceId: voiceId || "EXAVITQu4vr4xnSDxMaL" // Default ElevenLabs voice if not specified
      },
      model: {
        provider: languageModel === "gemini" ? "google" : "openai",
        model: languageModel === "gemini" ? "gemini-1.5-flash" : "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ],
        tools: [
          // Memory tool for Pinecone
          {
            type: "function",
            function: {
              name: "save-to-memory",
              description: "Save important information to agent's memory",
              parameters: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  metadata: { type: "object" }
                },
                required: ["content"]
              }
            },
            server: { url: `${process.env.NEXT_PUBLIC_APP_URL}/api/memory/save` }
          },
          // Query memory tool
          {
            type: "function",
            function: {
              name: "query-memory",
              description: "Query agent's memory for relevant information",
              parameters: {
                type: "object",
                properties: {
                  query: { type: "string" }
                },
                required: ["query"]
              }
            },
            server: { url: `${process.env.NEXT_PUBLIC_APP_URL}/api/memory/query` }
          },
          // Query knowledge base tool
          {
            type: "function",
            function: {
              name: "query-knowledge-base",
              description: "Query document knowledge base for relevant information",
              parameters: {
                type: "object",
                properties: {
                  query: { type: "string" },
                  knowledgeBaseId: { type: "string" }
                },
                required: ["query", "knowledgeBaseId"]
              }
            },
            server: { url: `${process.env.NEXT_PUBLIC_APP_URL}/api/knowledge/query` }
          },
          // Cal.com scheduling tool
          {
            type: "function",
            function: {
              name: "schedule-appointment",
              description: "Schedule an appointment using Cal.com",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string" },
                  email: { type: "string" },
                  name: { type: "string" }
                },
                required: ["title", "date", "email"]
              }
            },
            server: { url: `${process.env.NEXT_PUBLIC_APP_URL}/api/tools/schedule` }
          },
          // Email sending tool
          {
            type: "function",
            function: {
              name: "send-email",
              description: "Send an email to a recipient",
              parameters: {
                type: "object",
                properties: {
                  to: { type: "string" },
                  subject: { type: "string" },
                  body: { type: "string" }
                },
                required: ["to", "subject", "body"]
              }
            },
            server: { url: `${process.env.NEXT_PUBLIC_APP_URL}/api/tools/email` }
          }
        ]
      }
    })

    // Store the Vapi assistant ID in our database
    await db.agent.update({
      where: { id: agentId },
      data: { vapiAssistantId: assistant.id }
    })

    return assistant
  } catch (error) {
    console.error('Error creating Vapi assistant:', error)
    throw error
  }
}

/**
 * Update an existing Vapi assistant
 */
export async function updateVapiAssistant({
  vapiAssistantId,
  name,
  firstMessage,
  systemPrompt,
  voiceId,
  languageModel
}: {
  vapiAssistantId: string
  name?: string
  firstMessage?: string
  systemPrompt?: string
  voiceId?: string
  languageModel?: string
}) {
  try {
    const updateData: any = {}
    
    if (name) updateData.name = name
    if (firstMessage) updateData.firstMessage = firstMessage
    
    if (voiceId) {
      updateData.voice = {
        provider: "elevenlabs",
        voiceId
      }
    }
    
    if (languageModel) {
      updateData.model = {
        provider: languageModel === "gemini" ? "google" : "openai",
        model: languageModel === "gemini" ? "gemini-1.5-flash" : "gpt-4"
      }
    }
    
    if (systemPrompt) {
      updateData.model = {
        ...(updateData.model || {}),
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ]
      }
    }
    
    const assistant = await vapi.assistants.update(vapiAssistantId, updateData)
    return assistant
  } catch (error) {
    console.error('Error updating Vapi assistant:', error)
    throw error
  }
}

/**
 * Delete a Vapi assistant
 */
export async function deleteVapiAssistant(vapiAssistantId: string) {
  try {
    await vapi.assistants.delete(vapiAssistantId)
    return true
  } catch (error) {
    console.error('Error deleting Vapi assistant:', error)
    throw error
  }
}

/**
 * Create a phone call with a Vapi assistant
 */
export async function createVapiCall({
  vapiAssistantId,
  phoneNumber,
  agentId,
  userId
}: {
  vapiAssistantId: string
  phoneNumber: string
  agentId: string
  userId: string
}) {
  try {
    const call = await vapi.calls.create({
      assistant_id: vapiAssistantId,
      to: phoneNumber,
      server_params: {
        agentId,
        userId
      }
    })
    
    // Create call log in database
    await db.callLog.create({
      data: {
        agentId,
        userId,
        callSid: call.id,
        toNumber: phoneNumber,
        status: 'scheduled',
        direction: 'outbound'
      }
    })
    
    return call
  } catch (error) {
    console.error('Error creating Vapi call:', error)
    throw error
  }
}

/**
 * Get the status of a call
 */
export async function getVapiCallStatus(callId: string) {
  try {
    const call = await vapi.calls.retrieve(callId)
    return call
  } catch (error) {
    console.error('Error getting Vapi call status:', error)
    throw error
  }
}

/**
 * End a call
 */
export async function endVapiCall(callId: string) {
  try {
    await vapi.calls.end(callId)
    return true
  } catch (error) {
    console.error('Error ending Vapi call:', error)
    throw error
  }
}

/**
 * Get a list of available voices from ElevenLabs
 */
export async function getElevenLabsVoices() {
  try {
    // This is a placeholder - in a real implementation,
    // you would fetch from ElevenLabs API
    return [
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Rachel (Female)" },
      { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Male)" },
      { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam (Neutral)" },
      { id: "jBpfuIE2acCO8z3wKNLl", name: "Emily (Female)" },
      { id: "onwK4e9ZLuTAKqWW3q2T", name: "Michael (Male)" }
    ]
  } catch (error) {
    console.error('Error getting ElevenLabs voices:', error)
    throw error
  }
}

/**
 * Add tools to a Vapi assistant
 */
export async function addToolsToVapiAssistant({
  vapiAssistantId,
  tools
}: {
  vapiAssistantId: string
  tools: Array<{
    type: string
    function: {
      name: string
      description: string
      parameters: any
    }
    server: {
      url: string
    }
  }>
}) {
  try {
    const assistant = await vapi.assistants.update(vapiAssistantId, {
      model: {
        tools
      }
    })
    return assistant
  } catch (error) {
    console.error('Error adding tools to Vapi assistant:', error)
    throw error
  }
} 