"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeftIcon, 
  PhoneCallIcon, 
  PlayIcon, 
  Square, 
  Loader2Icon
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AgentConfiguration } from "@/components/agent/agent-configuration"

import { AgentTools } from "@/components/agent/agent-tools"
import { AgentKnowledgeBase } from "@/components/agent/agent-knowledge-base"
import { AgentCallHistory } from "@/components/agent/agent-call-history"

interface Agent {
  id: string
  name: string
  description: string
  isActive: boolean
  callCount: number
  lastActive?: string
  model: string
  voice: string
  firstMessage: string
  systemPrompt: string
  createdAt: string
}

export default function AgentDetailPage() {
  const { id } = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const [activeTab, setActiveTab] = useState("configuration")
  
  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        // In a real app, you would fetch this from the API
        // For now, use mock data
        const mockAgent: Agent = {
          id: id as string,
          name: "Customer Support Agent",
          description: "Handles basic customer inquiries and routes to appropriate departments",
          isActive: true,
          callCount: 230,
          lastActive: "2023-10-15T14:30:45Z",
          model: "gpt-4",
          voice: "alloy",
          firstMessage: "Hello! Thank you for calling our support line. How can I help you today?",
          systemPrompt: "You are a helpful customer support agent. Your goal is to help customers solve their problems efficiently and professionally. If you can't solve their issue, collect their information and let them know a human agent will contact them.",
          createdAt: "2023-06-10T09:15:00Z"
        }
        
        setAgent(mockAgent)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching agent details:", error)
        toast.error("Failed to load agent details")
        setIsLoading(false)
      }
    }
    
    fetchAgentDetails()
  }, [id])
  
  const toggleAgentStatus = async () => {
    if (!agent) return
    
    setIsToggling(true)
    
    try {
      // In a real app, you would call your API to update the status
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setAgent({
        ...agent,
        isActive: !agent.isActive
      })
      
      const action = agent.isActive ? "deactivated" : "activated"
      toast.success(`Agent ${action} successfully`)
    } catch (error) {
      console.error("Error updating agent status:", error)
      toast.error("Failed to update agent status")
    } finally {
      setIsToggling(false)
    }
  }
  
  const handleCall = async () => {
    if (!agent) return
    
    toast.info("Initiating call with agent...", {
      description: "This feature is not yet implemented in the demo."
    })
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }
  
  if (isLoading) {
    return (
      <div className="mx-auto px-4 sm:px-6 py-10 max-w-7xl container">
        <div className="flex justify-center items-center h-64">
          <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    )
  }
  
  if (!agent) {
    return (
      <div className="mx-auto px-4 sm:px-6 py-10 max-w-7xl container">
        <div className="py-10 text-center">
          <h3 className="font-medium text-lg">Agent not found</h3>
          <p className="mt-2 text-gray-500">The requested agent could not be found</p>
          <Link href="/agents">
            <Button className="mt-4">
              <ArrowLeftIcon className="mr-2 w-4 h-4" /> Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="mx-auto px-4 sm:px-6 py-10 max-w-7xl container">
      {/* Header with agent details and controls */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/agents">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-serif font-medium text-gray-900 text-3xl">{agent.name}</h1>
          </div>
          <p className="mt-2 text-gray-500">{agent.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={agent.isActive ? "destructive" : "default"}
            disabled={isToggling}
            onClick={toggleAgentStatus}
          >
            {isToggling ? (
              <Loader2Icon className="mr-2 w-4 h-4 animate-spin" />
            ) : agent.isActive ? (
              <Square className="mr-2 w-4 h-4" />
            ) : (
              <PlayIcon className="mr-2 w-4 h-4" />
            )}
            {agent.isActive ? "Stop Agent" : "Start Agent"}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleCall}
            disabled={!agent.isActive}
          >
            <PhoneCallIcon className="mr-2 w-4 h-4" />
            Call Agent
          </Button>
        </div>
      </div>
      
      {/* Agent stats */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3 mb-8">
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm">Status</p>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${agent.isActive ? "bg-green-500" : "bg-gray-400"}`} />
            <p className="font-medium">{agent.isActive ? "Active" : "Inactive"}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm">Total Calls</p>
          <p className="mt-1 font-medium text-lg">{agent.callCount}</p>
        </div>
        
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm">Last Active</p>
          <p className="mt-1 font-medium text-sm">{formatDate(agent.lastActive)}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="history">Call History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration">
          <AgentConfiguration agent={agent} setAgent={setAgent} />
        </TabsContent>
        
        <TabsContent value="knowledge">
          <AgentKnowledgeBase agentId={agent.id} />
        </TabsContent>
        
        <TabsContent value="tools">
          <AgentTools agentId={agent.id} />
        </TabsContent>
        
        <TabsContent value="history">
          <AgentCallHistory agentId={agent.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 