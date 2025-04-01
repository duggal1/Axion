"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { 
  CalendarIcon, 
  MailIcon, 
  SearchIcon, 
  ServerIcon, 
  CalculatorIcon, 
  DatabaseIcon, 
  GlobeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  FilterIcon,
  ArrowUpDownIcon
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { ToolType } from "@prisma/client"

interface Tool {
  id: string
  name: string
  description: string
  type: ToolType
  isActive: boolean
  config: any
  createdAt: string
  updatedAt: string
}

export function ToolList() {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("recent")
  const [toolToDelete, setToolToDelete] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  
  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam)
    }
    
    fetchTools()
  }, [categoryParam])
  
  const fetchTools = async () => {
    setIsLoading(true)
    try {
      // In a real app, fetch from API
      // const response = await fetch("/api/tools")
      // const data = await response.json()
      // setTools(data.tools)
      
      // Mock data
      const mockTools: Tool[] = [
        {
          id: "1",
          name: "Gmail Integration",
          description: "Send emails via Gmail API",
          type: "emailSender",
          isActive: true,
          config: { 
            authType: "oauth",
            isConfigured: true
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          name: "Cal.com Appointments",
          description: "Schedule appointments via Cal.com API",
          type: "calendar",
          isActive: true,
          config: { 
            apiKey: "************", 
            defaultEventType: "30min"
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString()
        },
        {
          id: "3",
          name: "Weather API",
          description: "Get weather information",
          type: "api",
          isActive: false,
          config: {
            apiKey: "************",
            units: "metric"
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "4",
          name: "Pinecone Vector Search",
          description: "Search vector database for relevant information",
          type: "database",
          isActive: true,
          config: {
            apiKey: "************",
            environment: "us-west1-gcp",
            index: "knowledge-base"
          },
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: "5",
          name: "Currency Calculator",
          description: "Calculate currency conversions",
          type: "calculator",
          isActive: true,
          config: {
            apiKey: "************",
            baseRate: "USD"
          },
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: "6",
          name: "Web Search",
          description: "Search the web for real-time information",
          type: "webSearch",
          isActive: true,
          config: {
            engine: "google",
            apiKey: "************"
          },
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          updatedAt: new Date(Date.now() - 345600000).toISOString()
        }
      ]
      
      setTools(mockTools)
      
    } catch (error) {
      console.error("Error fetching tools:", error)
      toast.error("Failed to load tools")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleToolStateChange = async (id: string, isActive: boolean) => {
    try {
      // In a real app, update via API
      // await fetch(`/api/tools/${id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ isActive })
      // })
      
      // Update local state
      setTools(tools.map(tool => 
        tool.id === id ? { ...tool, isActive } : tool
      ))
      
      toast.success(`Tool ${isActive ? 'enabled' : 'disabled'}`)
    } catch (error) {
      console.error("Error updating tool:", error)
      toast.error("Failed to update tool status")
    }
  }
  
  const handleDeleteTool = async () => {
    if (!toolToDelete) return
    
    try {
      // In a real app, delete via API
      // await fetch(`/api/tools/${toolToDelete}`, {
      //   method: "DELETE"
      // })
      
      // Update local state
      setTools(tools.filter(tool => tool.id !== toolToDelete))
      
      toast.success("Tool deleted successfully")
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast.error("Failed to delete tool")
    } finally {
      setToolToDelete(null)
    }
  }
  
  // Filter tools based on search, tab, and type filter
  const filteredTools = tools.filter(tool => {
    // Search query filter
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Tab filter
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "active" && tool.isActive) || 
      (activeTab === "inactive" && !tool.isActive)
    
    // Type filter
    const matchesType = !filterType || tool.type === filterType
    
    return matchesSearch && matchesTab && matchesType
  })
  
  // Sort tools
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortOption) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "updated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "alphabetical":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
  
  // Get tool icon based on type
  const getToolIcon = (type: string) => {
    switch (type) {
      case "emailSender":
        return <MailIcon className="w-5 h-5" />
      case "calendar":
        return <CalendarIcon className="w-5 h-5" />
      case "api":
        return <ServerIcon className="w-5 h-5" />
      case "database":
        return <DatabaseIcon className="w-5 h-5" />
      case "calculator":
        return <CalculatorIcon className="w-5 h-5" />
      case "webSearch":
        return <SearchIcon className="w-5 h-5" />
      default:
        return <GlobeIcon className="w-5 h-5" />
    }
  }
  
  // Get user-friendly type name
  const getTypeName = (type: string) => {
    switch (type) {
      case "emailSender":
        return "Email"
      case "calendar":
        return "Calendar"
      case "api":
        return "API"
      case "database":
        return "Database"
      case "calculator":
        return "Calculator"
      case "webSearch":
        return "Web Search"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="bg-gray-200 mb-4 rounded-md w-1/4 h-6"></div>
              <div className="bg-gray-200 mb-2 rounded-md w-3/4 h-4"></div>
              <div className="bg-gray-200 rounded-md w-1/2 h-4"></div>
              <div className="flex justify-between mt-6">
                <div className="bg-gray-200 rounded-md w-1/5 h-8"></div>
                <div className="bg-gray-200 rounded-md w-1/6 h-8"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex md:flex-row flex-col justify-between gap-4">
        <div className="relative w-full md:w-96">
          <SearchIcon className="top-2.5 left-3 absolute w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search tools..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("emailSender")}>
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("calendar")}>
                Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("api")}>
                API
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("database")}>
                Database
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("calculator")}>
                Calculator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("webSearch")}>
                Web Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDownIcon className="w-4 h-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption("recent")}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("updated")}>
                Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {renderToolList(sortedTools)}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          {renderToolList(sortedTools)}
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-4">
          {renderToolList(sortedTools)}
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!toolToDelete} onOpenChange={(open) => !open && setToolToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this tool?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The tool will be permanently removed and any agents using it may lose functionality.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToolToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTool}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
  
  function renderToolList(tools: Tool[]) {
    if (tools.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <ServerIcon className="mb-4 w-12 h-12 text-gray-300" />
          <h3 className="font-medium text-lg">No tools found</h3>
          <p className="mt-2 text-gray-500">
            {searchQuery 
              ? "Try adjusting your search or filters"
              : "Create your first tool to get started"}
          </p>
        </div>
      )
    }
    
    return (
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.id} className={`overflow-hidden transition-all ${!tool.isActive ? 'opacity-70' : ''}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${tool.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {getToolIcon(tool.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{tool.name}</h3>
                    <p className="text-gray-500 text-sm">{tool.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <PencilIcon className="mr-2 w-4 h-4" />
                      Edit Tool
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setToolToDelete(tool.id)} className="text-destructive">
                      <TrashIcon className="mr-2 w-4 h-4" />
                      Delete Tool
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant={tool.isActive ? "default" : "outline"}>
                  {getTypeName(tool.type)}
                </Badge>
                <Badge variant="outline" className="bg-gray-50">
                  {new Date(tool.updatedAt).toLocaleDateString()}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`tool-active-${tool.id}`}
                    checked={tool.isActive}
                    onCheckedChange={(checked) => handleToolStateChange(tool.id, checked)}
                  />
                  <Label htmlFor={`tool-active-${tool.id}`}>
                    {tool.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
                
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
} 