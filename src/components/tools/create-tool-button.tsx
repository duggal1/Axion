/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToolType } from "@prisma/client"
import { PlusCircleIcon } from "lucide-react"

// Define form schema for tool creation including configuration fields
const toolSchema = z.object({
  name: z.string().min(3, {
    message: "Tool name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  type: z.enum(["emailSender", "calendar", "api", "database", "calculator", "webSearch", "custom"]),
  
  // Configuration fields based on type
  emailProvider: z.string().optional(),
  emailApiKey: z.string().optional(),
  calendarProvider: z.string().optional(),
  calendarApiKey: z.string().optional(),
  databaseProvider: z.string().optional(),
  databaseApiKey: z.string().optional(),
  databaseIndex: z.string().optional(),
  searchProvider: z.string().optional(),
  searchApiKey: z.string().optional(),
  apiEndpoint: z.string().optional(),
})

export function CreateToolButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedType, setSelectedType] = useState<ToolType | null>(null)
  
  // Initialize form
  const form = useForm<z.infer<typeof toolSchema>>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "api",
    },
  })
  
  // Watch for type changes to show correct config options
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type") {
        setSelectedType(value.type as ToolType)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof toolSchema>) => {
    setIsCreating(true)
    
    try {
      // In a real app, would make API call
      // const response = await fetch("/api/tools", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     ...values,
      //     config: getConfigForType(values.type)
      //   })
      // })
      
      // if (!response.ok) throw new Error("Failed to create tool")
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here we use the values for logging (prevents the unused parameter lint error)
      console.log("Creating tool with values:", values)
      
      toast.success("Tool created successfully!")
      setIsOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error creating tool:", error)
      toast.error("Failed to create tool. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }
  
  // Render config fields based on tool type
  const renderConfigFields = () => {
    switch (selectedType) {
      case "emailSender":
        return (
          <>
            <FormField
              control={form.control}
              name="emailProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gmail">Gmail</SelectItem>
                      <SelectItem value="outlook">Outlook</SelectItem>
                      <SelectItem value="smtp">Custom SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the email provider to use for sending emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your API key or access token for the selected provider.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      
      case "calendar":
        return (
          <>
            <FormField
              control={form.control}
              name="calendarProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calendar Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select calendar provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="calcom">Cal.com</SelectItem>
                      <SelectItem value="google">Google Calendar</SelectItem>
                      <SelectItem value="outlook">Outlook Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the calendar provider to use for scheduling.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calendarApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your API key for the selected calendar provider.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      
      case "database":
        return (
          <>
            <FormField
              control={form.control}
              name="databaseProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vector Database</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vector database" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pinecone">Pinecone</SelectItem>
                      <SelectItem value="qdrant">Qdrant</SelectItem>
                      <SelectItem value="weaviate">Weaviate</SelectItem>
                      <SelectItem value="chroma">ChromaDB</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the vector database to use for knowledge retrieval.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="databaseApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your API key for the selected vector database.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="databaseIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Index Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your index name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the vector index to use.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      
      case "webSearch":
        return (
          <>
            <FormField
              control={form.control}
              name="searchProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select search provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="bing">Bing</SelectItem>
                      <SelectItem value="tavily">Tavily AI</SelectItem>
                      <SelectItem value="serper">Serper</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the search provider to use for web searches.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searchApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your API key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your API key for the selected search provider.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      
      default:
        return (
          <FormField
            control={form.control}
            name="apiEndpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Endpoint</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.example.com" {...field} />
                </FormControl>
                <FormDescription>
                  The API endpoint for this tool.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }
  
  // Get user-friendly name for tool type
  const getToolTypeName = (type: ToolType) => {
    switch (type) {
      case "emailSender": return "Email Sender"
      case "calendar": return "Calendar Scheduling"
      case "api": return "API Integration"
      case "database": return "Database"
      case "calculator": return "Calculator"
      case "webSearch": return "Web Search"
      case "custom": return "Custom Tool"
      default: return type
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircleIcon className="w-4 h-4" />
          <span>Create Tool</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a new tool</DialogTitle>
          <DialogDescription>
            Add a new tool to your AI voice agents. Configured tools can be used by agents to perform actions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tool Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tool name" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for this tool.
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
                      placeholder="Enter a description of what this tool does" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the tool&apos;s functionality.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tool Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tool type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="emailSender">Email Sender</SelectItem>
                      <SelectItem value="calendar">Calendar Scheduling</SelectItem>
                      <SelectItem value="api">API Integration</SelectItem>
                      <SelectItem value="database">Vector Database</SelectItem>
                      <SelectItem value="calculator">Calculator</SelectItem>
                      <SelectItem value="webSearch">Web Search</SelectItem>
                      <SelectItem value="custom">Custom Tool</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of tool determines available configurations and capabilities.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Render config fields based on selected type */}
            {selectedType && (
              <div className="pt-2 border-t">
                <h4 className="mb-3 font-medium text-sm">
                  {getToolTypeName(selectedType)} Configuration
                </h4>
                {renderConfigFields()}
              </div>
            )}
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Tool"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 