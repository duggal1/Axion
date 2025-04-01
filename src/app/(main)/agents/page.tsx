"use client"

import { useEffect, useState } from "react"
import { AgentList } from "@/components/agent/agent-list"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SearchIcon, PlusIcon, Square } from "lucide-react"
import { toast } from "sonner"
import { CreateAgentButton } from "@/components/agent/create-agent-button"

export default function AgentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [agentCount, setAgentCount] = useState(0)
  
  useEffect(() => {
    const fetchAgentCount = async () => {
      try {
        // In a real app, you would fetch this from the API
        // For now, set a mock value
        setAgentCount(12)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching agent count:", error)
        toast.error("Failed to load agent data")
        setIsLoading(false)
      }
    }
    
    fetchAgentCount()
  }, [])
  
  return (
    <div className="mx-auto px-4 sm:px-6 py-10 max-w-7xl container">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif font-medium text-gray-900 text-4xl">AI Voice Agents</h1>
          <p className="mt-2 text-gray-500">
            {isLoading ? "Loading..." : `${agentCount} AI assistants ready to help`}
          </p>
        </div>
        
        <CreateAgentButton />
      </div>
      
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <SearchIcon className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
          <Input
            placeholder="Search agents..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[140px]">
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
      
      <AgentList 
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        sortBy={sortBy}
      />
    </div>
  )
} 