/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import nodemailer from "nodemailer"
import { google } from "googleapis"

// Email sending for AI agents
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, body, cc, bcc, agentId, toolId } = await req.json()
    
    if (!to || !subject || !body) {
      return NextResponse.json({ 
        error: "Missing required fields: to, subject, and body are required" 
      }, { status: 400 })
    }
    
    // Get the user to obtain their credentials
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true }
    })
    
    if (!user?.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }
    
    // Get the tool configuration for the specified tool
    let emailConfig: any = {}
    
    if (toolId) {
      // If a specific tool ID is provided, use its configuration
      const tool = await db.tool.findUnique({
        where: { 
          id: toolId,
          userId
        },
        select: { config: true }
      })
      
      if (!tool) {
        return NextResponse.json({ error: "Email tool not found" }, { status: 404 })
      }
      
      emailConfig = tool.config
    } else if (agentId) {
      // If an agent ID is provided, find the email tool configured for that agent
      const agentTool = await db.agentTool.findFirst({
        where: {
          agentId,
          tool: {
            type: "emailSender",
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
        emailConfig = agentTool.tool.config
      }
    }
    
    if (!emailConfig.provider) {
      // Fall back to default email provider if no tool is specified
      emailConfig = {
        provider: process.env.EMAIL_PROVIDER || "smtp",
        host: process.env.EMAIL_SERVER || "smtp.gmail.com",
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Boolean(process.env.EMAIL_SECURE) || false,
        user: process.env.EMAIL_USER || user.email,
        password: process.env.EMAIL_PASSWORD
      }
    }
    
    // Create email transporter based on provider
    let transporter
    try {
      switch (emailConfig.provider?.toLowerCase()) {
        case "gmail":
          transporter = await createGmailTransporter(user.email, emailConfig)
          break
        case "outlook":
          transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
              user: emailConfig.user || user.email,
              pass: emailConfig.password
            }
          })
          break
        default: // smtp
          transporter = nodemailer.createTransport({
            host: emailConfig.host || "smtp.gmail.com",
            port: emailConfig.port || 587,
            secure: emailConfig.secure || false,
            auth: {
              user: emailConfig.user || user.email,
              pass: emailConfig.password
            }
          })
      }
    } catch (error) {
      console.error("Error creating email transporter:", error)
      return NextResponse.json({ 
        error: "Failed to configure email service"
      }, { status: 500 })
    }
    
    if (!transporter) {
      return NextResponse.json({ 
        error: "Email service not configured" 
      }, { status: 500 })
    }
    
    // Send email
    const info = await transporter.sendMail({
      from: emailConfig.from || user.email,
      to,
      cc,
      bcc,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br/>")
    })
    
    // Log sent email in database
    const sentEmail = await db.sentEmail.create({
      data: {
        to,
        subject,
        body,
        cc: cc || null,
        bcc: bcc || null,
        userId,
        agentId: agentId || null,
        messageId: info.messageId
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      email: {
        id: sentEmail.id,
        messageId: info.messageId,
        to,
        subject
      }
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ 
      error: "Failed to send email",
      details: error
    }, { status: 500 })
  }
}

// Helper for Gmail OAuth
async function createGmailTransporter(userEmail: string, config: any) {
  // Create OAuth client
  const oauth2Client = new google.auth.OAuth2(
    config.clientId || process.env.GMAIL_CLIENT_ID,
    config.clientSecret || process.env.GMAIL_CLIENT_SECRET,
    config.redirectUri || process.env.GMAIL_REDIRECT_URI
  )
  
  // Set credentials
  oauth2Client.setCredentials({
    refresh_token: config.refreshToken
  })
  
  // Get access token
  const accessToken = await new Promise<string>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token || "")
    })
  })
  
  // Create transporter
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: userEmail,
      accessToken,
      clientId: config.clientId || process.env.GMAIL_CLIENT_ID,
      clientSecret: config.clientSecret || process.env.GMAIL_CLIENT_SECRET,
      refreshToken: config.refreshToken
    }
  })
} 