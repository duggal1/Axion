"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PhoneCallIcon, PauseIcon, PlayIcon, ArrowLeftIcon, ClockIcon } from "lucide-react"
import { CallAgent } from "@/components/agent/call-agent"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"

interface AgentDetailHeaderProps {
  agentId: string
}

interface Agent {
  id: string
  name: string
  description: string | null
  avatar: string | null
  voiceId: string | null
  languageModel: string
  isActive: boolean
  vapiAssistantId: string | null
  createdAt: string
}

export function AgentDetailHeader({ agentId }: AgentDetailHeaderProps) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCallInterface, setShowCallInterface] = useState(false)
  
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/vapi/assistants/${agentId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch agent")
        }
        
        const data = await response.json()
        setAgent(data.agent)
      } catch (error) {
        console.error("Error fetching agent:", error)
        toast.error("Failed to load agent data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAgent()
  }, [agentId])
  
  const toggleAgentStatus = async () => {
    if (!agent) return
    
    try {
      const response = await fetch(`/api/vapi/assistants/${agentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !agent.isActive,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update agent")
      }
      
      // Update local state
      setAgent(prev => {
        if (!prev) return prev
        return { ...prev, isActive: !prev.isActive }
      })
      
      toast.success(`Agent ${agent.isActive ? "deactivated" : "activated"}`)
    } catch (error) {
      console.error("Error updating agent:", error)
      toast.error("Failed to update agent")
    }
  }
  
  const getLanguageModelBadge = (model: string) => {
    switch (model) {
      case "gemini":
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">Gemini</Badge>
      case "gpt-4":
        return <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-800">GPT-4</Badge>
      case "gpt-3.5-turbo":
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">GPT-3.5</Badge>
      default:
        return <Badge variant="outline">{model}</Badge>
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="text-gray-500">Loading agent details...</div>
      </div>
    )
  }
  
  if (!agent) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 h-[200px]">
        <div className="text-gray-700">Agent not found</div>
        <Link href="/agents">
          <Button variant="outline">
            <ArrowLeftIcon className="mr-2 w-4 h-4" /> Back to Agents
          </Button>
        </Link>
      </div>
    )
  }
  
  return (
    <>
      <div className="px-6 pb-2">
        <Link href="/agents" className="flex items-center mb-4 text-gray-500 hover:text-gray-900 text-sm">
          <ArrowLeftIcon className="mr-1 w-3 h-3" /> Back to agents
        </Link>
      </div>
      
      <div className="px-6 pb-6">
        <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex lg:flex-row flex-col justify-between gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="bg-gray-100 rounded-md w-16 h-16">
                  <AvatarFallback className="font-serif text-gray-600 text-xl">
                    {agent.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h1 className="font-serif font-medium text-gray-900 text-2xl">{agent.name}</h1>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant={agent.isActive ? "default" : "outline"} className="h-6">
                      {agent.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {getLanguageModelBadge(agent.languageModel)}
                    {agent.voiceId && (
                      <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-800">
                        Voice Enabled
                      </Badge>
                    )}
                  </div>
                  
                  {agent.description && (
                    <p className="mt-3 text-gray-600 text-sm">{agent.description}</p>
                  )}
                  
                  <div className="flex items-center gap-1 mt-3 text-gray-500 text-xs">
                    <ClockIcon className="w-3 h-3" />
                    <span>
                      Created {format(new Date(agent.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex sm:flex-row flex-col items-start lg:items-center gap-3">
                <Button
                  variant="outline"
                  onClick={toggleAgentStatus}
                  className="w-[140px]"
                >
                  {agent.isActive ? (
                    <>
                      <PauseIcon className="mr-2 w-4 h-4" /> Deactivate
                    </>
                  ) : (
                    <>
                      <PlayIcon className="mr-2 w-4 h-4" /> Activate
                    </>
                  )}
                </Button>
                
                <Button
                  variant={showCallInterface ? "outline" : "default"}
                  onClick={() => setShowCallInterface(!showCallInterface)}
                  className="w-[140px]"
                  disabled={!agent.vapiAssistantId}
                >
                  <PhoneCallIcon className="mr-2 w-4 h-4" />
                  {showCallInterface ? "Hide Call" : "Test Call"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showCallInterface && agent.vapiAssistantId && (
        <div className="px-6 pb-6">
          <CallAgent 
            agentId={agent.id}
            vapiAssistantId={agent.vapiAssistantId}
            agentName={agent.name}
            agentAvatar={agent.avatar}
          />
        </div>
      )}
    </>
  )
} 