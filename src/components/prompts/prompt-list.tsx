/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  Search as SearchIcon, 
  Tag as TagIcon,
  Copy as CopyIcon,
  MoreVertical as MoreIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Star as StarIcon,
  Check as CheckIcon,
  Filter as FilterIcon,
  SortAsc as SortAscIcon,
  Loader2 as LoaderIcon
} from "lucide-react"
import { cn } from "@/lib/cn"
import { toast } from "sonner"

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  category: "conversation" | "system" | "welcome" | "custom"
}

interface PromptListProps {
  className?: string
}

export function PromptList({ className }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "name" | "updated">("recent")
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  
  // Get all unique tags across prompts
  const allTags = Array.from(
    new Set(prompts.flatMap(prompt => prompt.tags))
  ).sort()
  
  useEffect(() => {
    fetchPrompts()
  }, [])
  
  const fetchPrompts = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockPrompts: Prompt[] = [
        {
          id: "1",
          title: "Standard Welcome Message",
          content: "Hello! Thank you for calling. I'm {{agentName}}, your virtual assistant. How can I help you today?",
          tags: ["welcome", "greeting", "onboarding"],
          isFavorite: true,
          createdAt: new Date(2023, 10, 15),
          updatedAt: new Date(2023, 11, 2),
          category: "welcome"
        },
        {
          id: "2",
          title: "Customer Support System Prompt",
          content: "You are a helpful customer support representative for a SaaS company. Your goal is to resolve customer issues efficiently while being empathetic. You can help with billing questions, technical issues, and product information.",
          tags: ["support", "system", "instructions"],
          isFavorite: false,
          createdAt: new Date(2023, 9, 10),
          updatedAt: new Date(2023, 9, 10),
          category: "system"
        },
        {
          id: "3",
          title: "Sales Qualification Questions",
          content: "1. What specific challenges are you facing with your current solution?\n2. What's your timeline for implementing a new solution?\n3. What's your budget range for this project?\n4. Who else is involved in the decision-making process?",
          tags: ["sales", "qualification", "questions"],
          isFavorite: true,
          createdAt: new Date(2023, 11, 5),
          updatedAt: new Date(2023, 11, 7),
          category: "conversation"
        },
        {
          id: "4",
          title: "Appointment Scheduling",
          content: "I'd be happy to schedule an appointment for you. What day and time works best for you? I have availability on {{availableDates}}. Once we confirm a time, I'll send you a calendar invitation with all the details.",
          tags: ["appointment", "scheduling", "calendar"],
          isFavorite: false,
          createdAt: new Date(2023, 10, 20),
          updatedAt: new Date(2023, 10, 25),
          category: "conversation"
        },
        {
          id: "5",
          title: "Product Demo Introduction",
          content: "I'm excited to walk you through our product today. During this demo, I'll show you the key features that address the challenges we discussed previously. Feel free to ask questions at any point - this is an interactive session designed for you to get the most value.",
          tags: ["demo", "sales", "introduction"],
          isFavorite: false,
          createdAt: new Date(2023, 8, 12),
          updatedAt: new Date(2023, 10, 18),
          category: "custom"
        }
      ]
      
      setPrompts(mockPrompts)
    } catch (error) {
      console.error("Error fetching prompts:", error)
      toast.error("Failed to load prompts")
    } finally {
      setIsLoading(false)
    }
  }
  
  const toggleFavorite = (promptId: string) => {
    setPrompts(prev => 
      prev.map(prompt => 
        prompt.id === promptId 
          ? { ...prompt, isFavorite: !prompt.isFavorite } 
          : prompt
      )
    )
    
    const prompt = prompts.find(p => p.id === promptId)
    if (prompt) {
      toast.success(`${prompt.isFavorite ? "Removed from" : "Added to"} favorites`)
    }
  }
  
  const copyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Prompt copied to clipboard")
  }
  
  const handleDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt)
  }
  
  const confirmDelete = () => {
    if (!promptToDelete) return
    
    // In a real app, you would call your API
    setPrompts(prev => prev.filter(p => p.id !== promptToDelete.id))
    toast.success("Prompt deleted successfully")
    setPromptToDelete(null)
  }
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    )
  }
  
  // Filter prompts based on active tab, search query, and selected tags
  const filteredPrompts = prompts.filter(prompt => {
    // Filter by category/tab
    if (activeTab !== "all" && activeTab !== "favorites") {
      if (prompt.category !== activeTab) return false
    }
    
    // Filter by favorites
    if (activeTab === "favorites" && !prompt.isFavorite) return false
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !prompt.title.toLowerCase().includes(query) &&
        !prompt.content.toLowerCase().includes(query) &&
        !prompt.tags.some(tag => tag.toLowerCase().includes(query))
      ) {
        return false
      }
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      if (!selectedTags.some(tag => prompt.tags.includes(tag))) {
        return false
      }
    }
    
    return true
  })
  
  // Sort prompts based on sort selection
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title)
      case "updated":
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      case "recent":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime()
    }
  })
  
  const getCategoryLabel = (category: Prompt["category"]) => {
    switch (category) {
      case "conversation": return "Conversation"
      case "system": return "System"
      case "welcome": return "Welcome"
      case "custom": return "Custom"
      default: return "Other"
    }
  }
  
  const getCategoryColor = (category: Prompt["category"]) => {
    switch (category) {
      case "conversation": return "bg-blue-50 text-blue-700 border-blue-200"
      case "system": return "bg-purple-50 text-purple-700 border-purple-200"
      case "welcome": return "bg-green-50 text-green-700 border-green-200"
      case "custom": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }
  
  return (
    <div className={className}>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex sm:flex-row flex-col justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <SearchIcon className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
            <Input
              placeholder="Search prompts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <FilterIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter by tag</span>
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-2 rounded-full h-5 font-normal">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {allTags.length === 0 ? (
                  <div className="px-2 py-4 text-gray-500 text-sm text-center">
                    No tags found
                  </div>
                ) : (
                  <div className="p-2">
                    {allTags.map(tag => (
                      <DropdownMenuItem
                        key={tag}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <TagIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span>{tag}</span>
                        </div>
                        {selectedTags.includes(tag) && (
                          <CheckIcon className="w-4 h-4 text-blue-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    
                    {selectedTags.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="justify-center font-medium text-blue-600"
                          onClick={() => setSelectedTags([])}
                        >
                          Clear all filters
                        </DropdownMenuItem>
                      </>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SortAscIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    sortBy === "recent" && "font-medium text-blue-600"
                  )}
                  onClick={() => setSortBy("recent")}
                >
                  Recently created
                  {sortBy === "recent" && <CheckIcon className="ml-1 w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    sortBy === "updated" && "font-medium text-blue-600"
                  )}
                  onClick={() => setSortBy("updated")}
                >
                  Recently updated
                  {sortBy === "updated" && <CheckIcon className="ml-1 w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    sortBy === "name" && "font-medium text-blue-600"
                  )}
                  onClick={() => setSortBy("name")}
                >
                  Alphabetical
                  {sortBy === "name" && <CheckIcon className="ml-1 w-4 h-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoaderIcon className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : sortedPrompts.length === 0 ? (
        <div className="py-12 border rounded-md text-center">
          <div className="flex flex-col items-center gap-2">
            <TagIcon className="w-10 h-10 text-gray-300" />
            <h3 className="mt-2 font-medium text-lg">No prompts found</h3>
            <p className="mt-1 text-gray-500 text-sm">
              {searchQuery || selectedTags.length > 0 ? 
                "Try adjusting your search or filters" : 
                "Create your first prompt to get started"}
            </p>
          </div>
        </div>
      ) : (
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          {sortedPrompts.map((prompt) => (
            <Card key={prompt.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="font-serif font-medium text-lg">{prompt.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={cn("text-xs", getCategoryColor(prompt.category))}>
                        {getCategoryLabel(prompt.category)}
                      </Badge>
                      {prompt.isFavorite && (
                        <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 text-xs">
                          <StarIcon className="fill-yellow-500 mr-1 w-3 h-3 text-yellow-500" />
                          Favorite
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2">
                        <MoreIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleFavorite(prompt.id)}
                      >
                        <StarIcon className="w-4 h-4" />
                        <span>{prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => copyPrompt(prompt.content)}
                      >
                        <CopyIcon className="w-4 h-4" />
                        <span>Copy to clipboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <EditIcon className="w-4 h-4" />
                        <span>Edit prompt</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                        onClick={() => handleDeletePrompt(prompt)}
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Delete prompt</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="bg-gray-50 p-3 border rounded min-h-[80px] text-sm whitespace-pre-line">
                  {prompt.content.length > 200 
                    ? `${prompt.content.substring(0, 200)}...` 
                    : prompt.content}
                </div>
                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {prompt.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-gray-100 hover:bg-gray-200 font-normal text-xs cursor-pointer"
                        onClick={() => {
                          setSelectedTags([tag])
                          setActiveTab("all")
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 text-gray-500 text-xs">
                Updated {new Date(prompt.updatedAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={!!promptToDelete} onOpenChange={(open) => !open && setPromptToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromptToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 