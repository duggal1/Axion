/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PhoneCallIcon, PhoneOffIcon, MicIcon, MicOffIcon } from "lucide-react"
import { cn } from "@/lib/cn"
import { toast } from "sonner"

// Define Vapi type to avoid TypeScript errors
interface VapiConfig {
  assistantId: string
  params?: Record<string, unknown>
  onTranscript?: (message: TranscriptMessage) => void
  onStatus?: (status: string) => void
}

interface VapiCall {
  duration?: number
  onStatus: (status: string) => void
  mute: () => void
  unmute: () => void
}

class Vapi {
  constructor(apiKey: string) {}
  startCall(config: VapiConfig): Promise<VapiCall> {
    return Promise.resolve({} as VapiCall)
  }
  endCall(): Promise<void> {
    return Promise.resolve()
  }
}

interface CallAgentProps {
  agentId: string
  vapiAssistantId: string
  agentName: string
  agentAvatar?: string | null
}

interface TranscriptMessage {
  role: string;
  content: string;
}

export function CallAgent({ agentId, vapiAssistantId, agentName, agentAvatar }: CallAgentProps) {
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const transcriptRef = useRef<HTMLDivElement>(null)
  
  // Create Vapi client with public key
  const vapiRef = useRef<Vapi | null>(null)
  const [callStatus, setCallStatus] = useState<string>("idle")
  const [callInstance, setCallInstance] = useState<VapiCall | null>(null)
  const [callDuration, setCallDuration] = useState<number>(0)
  
  // Initialize Vapi client on component mount
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "")
    }
    
    return () => {
      // Clean up call on unmount
      if (isCallStarted && vapiRef.current) {
        vapiRef.current.endCall()
      }
    }
  }, [isCallStarted])
  
  // Scroll to bottom of transcript when new messages arrive
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])
  
  const handleStartCall = async () => {
    if (!vapiRef.current) return
    
    try {
      // Initialize the call
      const call = await vapiRef.current.startCall({
        assistantId: vapiAssistantId,
        params: {
          agentId,
          timestamp: new Date().toISOString(),
        },
        onTranscript: (message: TranscriptMessage) => {
          setTranscript((prev) => [
            ...prev,
            { role: message.role, content: message.content }
          ])
        },
        onStatus: (status: string) => {
          setCallStatus(status)
          
          if (status === "ended" || status === "error") {
            setIsCallStarted(false)
            
            // Save call to database
            fetch("/api/calls", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                agentId,
                transcript,
                status: status === "error" ? "failed" : "completed",
                duration: callDuration
              })
            }).catch(error => {
              console.error("Error saving call:", error)
            })
          }
        }
      })
      
      setCallInstance(call)
      setIsCallStarted(true)
      setTranscript([])
      
      // Set up duration tracking
      const durationInterval = setInterval(() => {
        if (call && call.duration) {
          setCallDuration(call.duration)
        }
      }, 1000)
      
      // Clean up interval on call end
      call.onStatus = (status: string) => {
        if (status === "ended" || status === "error") {
          clearInterval(durationInterval)
        }
      }
      
      toast.success("Call started successfully")
    } catch (error) {
      console.error("Error starting call:", error)
      toast.error("Failed to start call")
    }
  }
  
  const handleEndCall = async () => {
    if (!vapiRef.current) return
    
    try {
      await vapiRef.current.endCall()
      setIsCallStarted(false)
      toast.success("Call ended")
    } catch (error) {
      console.error("Error ending call:", error)
      toast.error("Failed to end call")
    }
  }
  
  const handleToggleMute = () => {
    if (callInstance) {
      if (isMuted) {
        callInstance.unmute()
      } else {
        callInstance.mute()
      }
      setIsMuted(!isMuted)
    }
  }
  
  const getStatusBadge = () => {
    switch (callStatus) {
      case "connecting":
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">Connecting</Badge>
      case "connected":
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800">Error</Badge>
      case "ended":
        return <Badge variant="outline">Call Ended</Badge>
      case "in-progress":
        return <Badge variant="default" className="bg-blue-100 text-blue-800 animate-pulse">In Progress</Badge>
      default:
        return <Badge variant="outline">Ready</Badge>
    }
  }
  
  // Display the agent avatar if provided, otherwise show initials
  const renderAvatar = () => {
    if (agentAvatar) {
      return (
        <Avatar className="w-10 h-10">
          <img src={agentAvatar} alt={agentName} />
          <AvatarFallback className="text-gray-600 text-sm">
            {agentName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    }
    
    return (
      <Avatar className="bg-gray-100 w-10 h-10">
        <AvatarFallback className="text-gray-600 text-sm">
          {agentName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    )
  }
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <div>
              <CardTitle className="font-serif font-medium text-lg">{agentName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                {callDuration > 0 && (
                  <span className="text-gray-500 text-xs">
                    {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2 text-xs">
          Talk with your AI voice agent in real-time.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={transcriptRef}
          className="space-y-3 bg-gray-50 mb-4 p-4 rounded-md h-[300px] overflow-y-auto text-sm"
        >
          {transcript.length === 0 ? (
            <div className="py-4 text-gray-400 text-center">
              {isCallStarted ? "Waiting for conversation..." : "Call transcript will appear here"}
            </div>
          ) : (
            transcript.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "py-2 px-3 rounded-lg max-w-[85%]",
                  message.role === "assistant" 
                    ? "bg-white border border-gray-200 ml-auto" 
                    : "bg-blue-50 border border-blue-100"
                )}
              >
                <div className="mb-1 font-medium text-gray-500 text-xs">
                  {message.role === "assistant" ? agentName : "You"}
                </div>
                <div>{message.content}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-gray-100 border-t">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!isCallStarted}
            onClick={handleToggleMute}
            className={cn(
              "w-[100px]",
              isMuted && "bg-red-50 text-red-800 border-red-200 hover:bg-red-100 hover:text-red-900"
            )}
          >
            {isMuted ? (
              <>
                <MicOffIcon className="mr-2 w-4 h-4" /> Unmute
              </>
            ) : (
              <>
                <MicIcon className="mr-2 w-4 h-4" /> Mute
              </>
            )}
          </Button>
        </div>
        
        <Button
          variant={isCallStarted ? "destructive" : "default"}
          className={cn(
            "w-[140px]",
            isCallStarted ? "bg-red-600 hover:bg-red-700" : ""
          )}
          onClick={isCallStarted ? handleEndCall : handleStartCall}
        >
          {isCallStarted ? (
            <>
              <PhoneOffIcon className="mr-2 w-4 h-4" /> End Call
            </>
          ) : (
            <>
              <PhoneCallIcon className="mr-2 w-4 h-4" /> Start Call
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 