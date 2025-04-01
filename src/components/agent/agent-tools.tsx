/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
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
  WrenchIcon, 
  Globe as GlobeIcon,
  Loader2 as LoaderIcon, 
  Plus as PlusIcon, 
  Search as SearchIcon, 
  Settings as SettingsIcon, 
  Shield as ShieldIcon, 
  Trash as TrashIcon, 
  HelpCircle as CircleHelpIcon,
  ExternalLink as ExternalLinkIcon,
  User as UserIcon,
  Database as DatabaseIcon,
  List as ListIcon,
  Link as LinkIcon,
  Mail as EnvelopeIcon,
  Calendar as CalendarIcon
} from "lucide-react"
import { toast } from "sonner"

interface Tool {
  id: string
  name: string
  description: string
  type: "builtin" | "custom"
  isEnabled: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configuration?: Record<string, any>
}

// Form schema for custom tool
const customToolSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  apiEndpoint: z.string().url("Must be a valid URL"),
  requestTemplate: z.string().min(10, "Request template must be at least 10 characters").optional(),
  requestMethod: z.enum(["GET", "POST"]),
  authentication: z.enum(["none", "api_key", "bearer_token", "oauth"]).default("none")
})

type CustomToolValues = z.infer<typeof customToolSchema>

interface AgentToolsProps {
  agentId: string
}

export function AgentTools({ agentId }: AgentToolsProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddToolDialog, setShowAddToolDialog] = useState(false)
  
  // Initialize form with default values
  const form = useForm<CustomToolValues>({
    resolver: zodResolver(customToolSchema),
    defaultValues: {
      name: "",
      description: "",
      apiEndpoint: "",
      requestTemplate: "",
      requestMethod: "POST"
    },
  })
  
  useEffect(() => {
    const fetchTools = async () => {
      try {
        // In a real app, you would fetch this from the API
        // For now, use mock data
        const mockTools: Tool[] = [
          {
            id: "1",
            name: "Knowledge Base",
            description: "Access to agent's knowledge base for retrieving information",
            type: "builtin",
            isEnabled: true
          },
          {
            id: "2",
            name: "Calendar Integration",
            description: "Schedule appointments and check availability",
            type: "builtin",
            isEnabled: true
          },
          {
            id: "3",
            name: "Customer Database",
            description: "Look up customer details and history",
            type: "builtin",
            isEnabled: false
          },
          {
            id: "4",
            name: "Email Sender",
            description: "Send emails to customers",
            type: "builtin",
            isEnabled: true
          },
          {
            id: "5",
            name: "Weather API",
            description: "Get current weather information",
            type: "custom",
            isEnabled: true,
            configuration: {
              apiEndpoint: "https://api.weather.com/v1/current",
              requestMethod: "GET",
              requestTemplate: "{\"location\": \"{{location}}\"}"
            }
          }
        ]
        
        setTools(mockTools)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching tools:", error)
        toast.error("Failed to load tools")
        setIsLoading(false)
      }
    }
    
    fetchTools()
  }, [agentId])
  
  const onToggleTool = async (toolId: string, enabled: boolean) => {
    try {
      setIsSaving(true)
      // In a real app, you would call your API to update the tool status
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setTools(prevTools => 
        prevTools.map(tool => 
          tool.id === toolId 
            ? { ...tool, isEnabled: enabled } 
            : tool
        )
      )
      
      toast.success(`Tool ${enabled ? "enabled" : "disabled"}`)
    } catch (error) {
      console.error("Error updating tool:", error)
      toast.error("Failed to update tool")
    } finally {
      setIsSaving(false)
    }
  }
  
  const onAddTool = async (values: CustomToolValues) => {
    try {
      setIsSaving(true)
      // In a real app, you would call your API to create the tool
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create new tool
      const newTool: Tool = {
        id: `custom-${Date.now()}`,
        name: values.name,
        description: values.description,
        type: "custom",
        isEnabled: true,
        configuration: {
          apiEndpoint: values.apiEndpoint,
          requestMethod: values.requestMethod,
          requestTemplate: values.requestTemplate || "",
          authentication: values.authentication
        }
      }
      
      // Add to local state
      setTools(prevTools => [...prevTools, newTool])
      
      // Reset form and close dialog
      form.reset()
      setShowAddToolDialog(false)
      
      toast.success("Custom tool added successfully")
    } catch (error) {
      console.error("Error adding tool:", error)
      toast.error("Failed to add tool")
    } finally {
      setIsSaving(false)
    }
  }
  
  const onDeleteTool = async (toolId: string) => {
    try {
      // In a real app, you would call your API to delete the tool
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Remove from local state
      setTools(prevTools => prevTools.filter(tool => tool.id !== toolId))
      
      toast.success("Tool deleted successfully")
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast.error("Failed to delete tool")
    }
  }
  
  const getToolIcon = (name: string) => {
    const nameLower = name.toLowerCase()
    
    if (nameLower.includes("email") || nameLower.includes("mail")) {
      return <EnvelopeIcon className="w-5 h-5 text-blue-500" />
    } else if (nameLower.includes("calendar") || nameLower.includes("schedule")) {
      return <CalendarIcon className="w-5 h-5 text-purple-500" />
    } else if (nameLower.includes("knowledge") || nameLower.includes("database")) {
      return <DatabaseIcon className="w-5 h-5 text-emerald-500" />
    } else if (nameLower.includes("search") || nameLower.includes("find")) {
      return <SearchIcon className="w-5 h-5 text-amber-500" />
    } else if (nameLower.includes("web") || nameLower.includes("api")) {
      return <GlobeIcon className="w-5 h-5 text-cyan-500" />
    } else if (nameLower.includes("security") || nameLower.includes("auth")) {
      return <SettingsIcon className="w-5 h-5 text-red-500" />
    } else if (nameLower.includes("user") || nameLower.includes("customer")) {
      return <UserIcon className="w-5 h-5 text-indigo-500" />
    } else if (nameLower.includes("list") || nameLower.includes("inventory")) {
      return <ListIcon className="w-5 h-5 text-orange-500" />
    } else if (nameLower.includes("link") || nameLower.includes("connect")) {
      return <LinkIcon className="w-5 h-5 text-sky-500" />
    } else {
      return <SettingsIcon className="w-5 h-5 text-gray-500" />
    }
  }
  
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Tools & Integrations</CardTitle>
              <CardDescription>
                Configure the tools your agent can use during conversations
              </CardDescription>
            </div>
            
            <Dialog open={showAddToolDialog} onOpenChange={setShowAddToolDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 w-4 h-4" />
                  Add Custom Tool
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add Custom Tool</DialogTitle>
                  <DialogDescription>
                    Create a custom tool to extend your agent&apos;s capabilities with external APIs.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onAddTool)} className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tool Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Weather API" {...field} />
                          </FormControl>
                          <FormDescription>
                            A short, descriptive name for the tool
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g. Gets current weather information for a specified location" 
                              className="resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what the tool does and when the agent should use it
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="apiEndpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Endpoint</FormLabel>
                          <FormControl>
                            <Input placeholder="https://api.example.com/v1/resource" {...field} />
                          </FormControl>
                          <FormDescription>
                            The URL the agent will call when using this tool
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requestMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Method</FormLabel>
                          <FormControl>
                            <select 
                              className="flex bg-background file:bg-transparent disabled:opacity-50 px-3 py-2 border border-input file:border-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full h-10 file:font-medium placeholder:text-muted-foreground text-sm file:text-sm disabled:cursor-not-allowed"
                              {...field}
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requestTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Template (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="{'param1': '{{value1}}', 'param2': '{{value2}}'}"
                              className="font-mono text-sm resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            JSON template for the request body. Use &#123;&#123;variable&#125;&#125; syntax for placeholders.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline" 
                        onClick={() => setShowAddToolDialog(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <LoaderIcon className="mr-2 w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <PlusIcon className="mr-2 w-4 h-4" />
                            Add Tool
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <LoaderIcon className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : tools.length === 0 ? (
            <div className="py-10 border border-dashed rounded-lg text-center">
              <SettingsIcon className="mx-auto w-10 h-10 text-gray-400" />
              <h3 className="mt-2 font-medium text-gray-900 text-sm">No tools configured</h3>
              <p className="mt-1 text-gray-500 text-sm">
                Add tools to enhance your agent&apos;s capabilities
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setShowAddToolDialog(true)}
                  variant="outline"
                >
                  <PlusIcon className="mr-2 w-4 h-4" />
                  Add Custom Tool
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {tools.map((tool) => (
                <div 
                  key={tool.id}
                  className="flex justify-between items-center hover:bg-gray-50 p-3 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    {getToolIcon(tool.name)}
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm">{tool.name}</h4>
                        {tool.type === "custom" && (
                          <span className="bg-blue-50 ml-2 px-2 py-0.5 rounded-full font-medium text-blue-700 text-xs">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs">{tool.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tool.isEnabled}
                      onCheckedChange={(checked) => onToggleTool(tool.id, checked)}
                      disabled={isSaving}
                    />
                    
                    {tool.type === "custom" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteTool(tool.id)}
                        disabled={isSaving}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {tool.type === "builtin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a 
                          href="#" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <CircleHelpIcon className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center">
              <CircleHelpIcon className="mr-2 w-4 h-4 text-gray-500" />
              <p className="text-gray-500 text-xs">
                Tools allow your AI agent to perform actions during conversations. Built-in tools are managed by the platform, while custom tools connect to your APIs.
              </p>
            </div>
            <div className="mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                size="sm"
                asChild
              >
                <a href="https://docs.vapi.ai/tools" target="_blank" rel="noopener noreferrer">
                  Learn more about tools <ExternalLinkIcon className="ml-1 w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 