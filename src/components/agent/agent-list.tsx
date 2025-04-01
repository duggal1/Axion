/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { 
  Card,
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  PhoneCallIcon, 
  MoreVerticalIcon, 
  Settings2Icon, 
  CalendarIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
  Square
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Agent {
  id: string
  name: string
  description: string | null
  avatar: string | null
  voiceId: string | null
  languageModel: string
  isActive: boolean
  createdAt: string
  callLogs: { id: string }[]
}

interface AgentListProps {
  searchQuery?: string
  filterStatus?: string
  sortBy?: string
}

export function AgentList({ searchQuery = "", filterStatus = "all", sortBy = "name" }: AgentListProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [localFilterStatus, setLocalFilterStatus] = useState(filterStatus)
  const [localSortBy, setLocalSortBy] = useState(sortBy)
  
  // Update local state when props change
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
    setLocalFilterStatus(filterStatus);
    setLocalSortBy(sortBy);
  }, [searchQuery, filterStatus, sortBy]);
  
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/vapi/assistants")
        if (!response.ok) {
          throw new Error("Failed to fetch agents")
        }
        
        const data = await response.json()
        setAgents(data.agents)
      } catch (error) {
        console.error("Error fetching agents:", error)
        toast.error("Failed to load agents")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAgents()
  }, [])
  
  const toggleAgentStatus = async (agentId: string, isCurrentlyActive: boolean) => {
    try {
      const response = await fetch(`/api/vapi/assistants/${agentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isCurrentlyActive,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update agent")
      }
      
      // Update local state
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId 
            ? { ...agent, isActive: !agent.isActive } 
            : agent
        )
      )
      
      toast.success(`Agent ${isCurrentlyActive ? "deactivated" : "activated"}`)
    } catch (error) {
      console.error("Error updating agent:", error)
      toast.error("Failed to update agent")
    }
  }
  
  const deleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) {
      return
    }
    
    try {
      const response = await fetch(`/api/vapi/assistants/${agentId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete agent")
      }
      
      // Update local state
      setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId))
      
      toast.success("Agent deleted successfully")
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast.error("Failed to delete agent")
    }
  }
  
  // Filter and sort agents
  const filteredAgents = agents
    .filter(agent => {
      // Filter by search query
      const matchesSearch = 
        agent.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(localSearchQuery.toLowerCase()))
      
      // Filter by status
      const matchesStatus = 
        localFilterStatus === "all" ||
        (localFilterStatus === "active" && agent.isActive) ||
        (localFilterStatus === "inactive" && !agent.isActive)
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort agents
      switch (localSortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "calls":
          return (b.callLogs?.length || 0) - (a.callLogs?.length || 0)
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-gray-500 text-center">Loading agents...</div>
      </div>
    )
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
  
  return (
    <div className="space-y-4">
      {!searchQuery && (
        <div className="flex sm:flex-row flex-col items-center gap-4">
          <div className="relative flex-1 w-full sm:w-auto">
            <Input
              placeholder="Search agents..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-9"
            />
            <div className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={localFilterStatus}
              onValueChange={setLocalFilterStatus}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={localSortBy}
              onValueChange={setLocalSortBy}
            >
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="calls">Call Count</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.length === 0 ? (
          <div className="col-span-full py-10 text-gray-500 text-center">
            No agents found matching your criteria
          </div>
        ) : (
          filteredAgents.map((agent) => (
            <Card key={agent.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-gray-100 w-9 h-9">
                      <AvatarFallback className="text-gray-600 text-sm">
                        {agent.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-serif font-medium text-md">{agent.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={agent.isActive ? "default" : "outline"} className="h-5 text-xs">
                          {agent.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {getLanguageModelBadge(agent.languageModel)}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVerticalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/agents/${agent.id}`}>
                          <Settings2Icon className="mr-2 w-4 h-4" /> Configure
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/agents/${agent.id}/calls`}>
                          <PhoneCallIcon className="mr-2 w-4 h-4" /> View Calls
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => toggleAgentStatus(agent.id, agent.isActive)}
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
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteAgent(agent.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <TrashIcon className="mr-2 w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {agent.description && (
                  <CardDescription className="mt-3 text-xs">{agent.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <PhoneCallIcon className="w-3 h-3" /> 
                    <span className="text-xs">{agent.callLogs?.length || 0} calls</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <CalendarIcon className="w-3 h-3" />
                    <span>
                      Created {new Date(agent.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="flex justify-between gap-2 w-full">
                  <Link href={`/agents/${agent.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  </Link>
                  <Button variant="default" size="sm" className="flex-1">
                    Call Agent
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 