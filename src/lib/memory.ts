import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT || 'gcp-starter'
})

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'models/embedding-001' })

// Get the Pinecone index for memory
const getMemoryIndex = () => {
  const indexName = process.env.PINECONE_MEMORY_INDEX_NAME || 'axion-ai'
  return pinecone.Index(indexName)
}

/**
 * Create embeddings for text using Gemini
 */
export async function createEmbedding(text: string): Promise<number[]> {
  const embedding = await model.embedContent(text)
  return embedding.embedding.values
}

/**
 * Save information to agent memory
 */
export async function saveToMemory({
  agentId,
  userId,
  content,
  metadata = {}
}: {
  agentId: string
  userId: string
  content: string
  metadata?: Record<string, any>
}) {
  try {
    const index = getMemoryIndex()
    const embedding = await createEmbedding(content)
    
    const recordId = `memory-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    
    await index.upsert({
      vectors: [{
        id: recordId,
        values: embedding,
        metadata: {
          agentId,
          userId,
          content,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }]
    })
    
    return { success: true, id: recordId }
  } catch (error) {
    console.error('Error saving to memory:', error)
    throw error
  }
}

/**
 * Query agent memory for relevant information
 */
export async function queryMemory({
  agentId,
  userId,
  query,
  limit = 5
}: {
  agentId: string
  userId: string
  query: string
  limit?: number
}) {
  try {
    const index = getMemoryIndex()
    const queryEmbedding = await createEmbedding(query)
    
    const results = await index.query({
      vector: queryEmbedding,
      topK: limit,
      filter: {
        agentId,
        userId
      },
      includeMetadata: true
    })
    
    return results.matches.map(match => ({
      content: match.metadata?.content,
      score: match.score,
      metadata: match.metadata
    }))
  } catch (error) {
    console.error('Error querying memory:', error)
    throw error
  }
}

/**
 * Delete all memory records for an agent
 */
export async function clearAgentMemory({
  agentId,
  userId
}: {
  agentId: string
  userId: string
}) {
  try {
    const index = getMemoryIndex()
    
    // Delete all vectors with matching agentId and userId
    await index.deleteMany({
      filter: {
        agentId,
        userId
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error clearing agent memory:', error)
    throw error
  }
} 