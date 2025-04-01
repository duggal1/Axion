import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { auth } from '@clerk/nextjs'
import { vapiService } from '@/lib/vapi-client'

// Sample text for voice preview
const SAMPLE_TEXT = "Hello! I'm your AI assistant. How can I help you today?"

/**
 * Handles GET requests to retrieve or generate voice samples
 * @param request 
 * @returns Voice sample info or error
 */
export async function GET(request: NextRequest) {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get voiceId from query params
  const url = new URL(request.url)
  const voiceId = url.searchParams.get('voiceId')
  
  if (!voiceId) {
    return NextResponse.json({ error: 'Voice ID is required' }, { status: 400 })
  }
  
  try {
    // Check if sample file already exists
    const publicDir = path.join(process.cwd(), 'public')
    const samplePath = path.join(publicDir, 'audio', `${voiceId}-sample.mp3`)
    const sampleExists = fs.existsSync(samplePath)
    
    // If sample doesn't exist or regenerate flag is set, create it
    const regenerate = url.searchParams.get('regenerate') === 'true'
    
    if (!sampleExists || regenerate) {
      // In a production environment, you would:
      // 1. Check if Vapi API key is set
      // 2. Call Vapi or ElevenLabs API to generate the sample
      // 3. Save the audio file to the samples directory
      
      // For demo purposes, we'll just ensure the directory exists
      const audioDir = path.join(publicDir, 'audio')
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true })
      }
      
      // Create an empty sample file if it doesn't exist
      if (!sampleExists) {
        // In a real implementation, this would be replaced with actual API call
        // and file download logic to get voice samples from ElevenLabs
        
        // For demo, we'll just create an empty file
        fs.writeFileSync(samplePath, '')
      }
    }
    
    // Return sample info
    return NextResponse.json({
      voiceId,
      url: `/audio/${voiceId}-sample.mp3`,
      text: SAMPLE_TEXT,
      status: sampleExists ? 'existing' : 'created'
    })
    
  } catch (error) {
    console.error('Error handling voice sample:', error)
    return NextResponse.json(
      { error: 'Failed to process voice sample' },
      { status: 500 }
    )
  }
}

/**
 * In a production environment, this endpoint would handle POST requests
 * to generate new voice samples by calling the ElevenLabs API
 */
export async function POST(request: NextRequest) {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { voiceId, text } = body
    
    if (!voiceId) {
      return NextResponse.json({ error: 'Voice ID is required' }, { status: 400 })
    }
    
    // The sample text to use - default to standard greeting if not provided
    const sampleText = text || SAMPLE_TEXT
    
    // In a production environment, you would:
    // 1. Validate the Vapi/ElevenLabs API key
    // 2. Call the text-to-speech API to generate the sample
    // 3. Save the audio file to the public directory
    
    // Return mock response for now
    return NextResponse.json({
      voiceId,
      url: `/audio/${voiceId}-sample.mp3`,
      text: sampleText,
      status: 'generated'
    })
    
  } catch (error) {
    console.error('Error generating voice sample:', error)
    return NextResponse.json(
      { error: 'Failed to generate voice sample' },
      { status: 500 }
    )
  }
} 