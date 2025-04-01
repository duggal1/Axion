"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { SaveIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  model: z.string(),
  voice: z.string(),
  firstMessage: z.string().min(10, "First message must be at least 10 characters"),
  systemPrompt: z.string().min(20, "System prompt must be at least 20 characters"),
})

type FormValues = z.infer<typeof formSchema>

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

interface AgentConfigurationProps {
  agent: Agent
  setAgent: (agent: Agent) => void
}

export function AgentConfiguration({ agent, setAgent }: AgentConfigurationProps) {
  const [isSaving, setIsSaving] = useState(false)
  
  // Initialize form with agent data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: agent.name,
      description: agent.description,
      model: agent.model,
      voice: agent.voice,
      firstMessage: agent.firstMessage,
      systemPrompt: agent.systemPrompt,
    },
  })
  
  const onSubmit = async (values: FormValues) => {
    setIsSaving(true)
    
    try {
      // In a real app, you would call your API to update the agent
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setAgent({
        ...agent,
        ...values,
      })
      
      toast.success("Agent updated successfully")
    } catch (error) {
      console.error("Error updating agent:", error)
      toast.error("Failed to update agent")
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic details of your AI voice agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your agent
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
                        {...field}
                        rows={3}
                        placeholder="Describe what this agent is designed to do"
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the agents purpose and capabilities
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Model</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the AI model that powers your agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Voice Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Configuration</CardTitle>
              <CardDescription>
                Configure how your agent sounds when speaking to callers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="fable">Fable</SelectItem>
                        <SelectItem value="onyx">Onyx</SelectItem>
                        <SelectItem value="nova">Nova</SelectItem>
                        <SelectItem value="shimmer">Shimmer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the voice your agent will use during calls
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="firstMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Hello! How can I help you today?"
                      />
                    </FormControl>
                    <FormDescription>
                      The initial greeting your agent will say when answering a call
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* System Prompt */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>
                Define your agents personality, capabilities, and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        placeholder="You are a helpful AI assistant..."
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription>
                      The system prompt guides how your agent responds. Be specific about the agents role, tone, and limitations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2Icon className="mr-2 w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 