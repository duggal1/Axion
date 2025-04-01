/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

interface CalScheduleParams {
  title: string
  description?: string
  date: string
  email: string
  name?: string
  location?: string
  eventTypeId?: string
  apiKey?: string
}

// Cal.com API integration
async function scheduleCalAppointment({
  title,
  description = "",
  date,
  email,
  name,
  location = "Phone call",
  eventTypeId,
  apiKey
}: CalScheduleParams) {
  try {
    // Use provided API key or fall back to environment variable
    const calApiKey = apiKey || process.env.CAL_API_KEY
    
    if (!calApiKey) {
      throw new Error("Cal.com API key not provided")
    }
    
    // Convert date to ISO format if not already
    const isoDate = new Date(date).toISOString()
    
    // Calculate end time (default to 30 min appointments)
    const startTime = new Date(isoDate)
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)
    
    const response = await fetch(`https://api.cal.com/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${calApiKey}`,
      },
      body: JSON.stringify({
        eventTypeId,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        name: name || email.split("@")[0],
        email,
        title,
        description,
        location,
        metadata: {
          scheduledByAI: true
        }
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Cal.com API error: ${errorData.message || response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error scheduling Cal.com appointment:", error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      title,
      description,
      date,
      email,
      name,
      location,
      agentId,
      toolId
    } = await req.json()
    
    if (!title || !date || !email) {
      return NextResponse.json({ 
        error: "Missing required fields: title, date, and email are required" 
      }, { status: 400 })
    }
    
    // Get the calendar tool configuration
    let calendarConfig: { 
      apiKey?: string;
      eventTypeId?: string;
      provider?: string;
    } = {}
    
    if (toolId) {
      // If a specific tool ID is provided, use its configuration
      const tool = await db.tool.findUnique({
        where: { 
          id: toolId,
          userId,
          type: "calendar"
        },
        select: { config: true }
      })
      
      if (!tool) {
        return NextResponse.json({ error: "Calendar tool not found" }, { status: 404 })
      }
      
      calendarConfig = tool.config as any
    } else if (agentId) {
      // If an agent ID is provided, find the calendar tool configured for that agent
      const agentTool = await db.agentTool.findFirst({
        where: {
          agentId,
          tool: {
            type: "calendar",
            userId
          }
        },
        include: {
          tool: {
            select: { config: true }
          }
        }
      })
      
      if (agentTool) {
        calendarConfig = agentTool.tool.config as any
      }
    }
    
    // Fall back to environment variables if no configuration found
    const eventTypeId = calendarConfig.eventTypeId || process.env.CAL_DEFAULT_EVENT_TYPE_ID
    const apiKey = calendarConfig.apiKey || process.env.CAL_API_KEY
    
    // Create the appointment using the configured provider
    let appointment
    
    if (calendarConfig.provider === "google") {
      // Google Calendar implementation would go here
      return NextResponse.json({ error: "Google Calendar not implemented yet" }, { status: 501 })
    } else {
      // Default to Cal.com
      appointment = await scheduleCalAppointment({
        title,
        description,
        date,
        email,
        name,
        location,
        eventTypeId,
        apiKey
      })
    }
    
    // Log the scheduled appointment in our database
    const scheduledEvent = await db.event.create({
      data: {
        title,
        description: description || "",
        date: new Date(date),
        email,
        name: name || email.split("@")[0],
        location: location || "Phone call",
        externalId: appointment.id,
        userId,
        agentId: agentId || null
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      appointment: {
        id: scheduledEvent.id,
        externalId: appointment.id,
        title,
        date: new Date(date),
        link: appointment.bookingLink || null
      }
    })
  } catch (error) {
    console.error("Error scheduling appointment:", error)
    return NextResponse.json({ 
      error: "Failed to schedule appointment",
      details: error
    }, { status: 500 })
  }
} 