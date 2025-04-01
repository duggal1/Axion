"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { VoicePreview } from "@/components/agent/voice-preview"

// Define voice options
const voiceOptions = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Rachel (Female)" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Male)" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam (Neutral)" },
  { id: "jBpfuIE2acCO8z3wKNLl", name: "Emily (Female)" },
  { id: "onwK4e9ZLuTAKqWW3q2T", name: "Michael (Male)" },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Agent name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  firstMessage: z.string().min(5, {
    message: "First message must be at least 5 characters.",
  }),
  systemPrompt: z.string().min(10, {
    message: "System prompt must be at least 10 characters.",
  }),
  voiceId: z.string().optional(),
  languageModel: z.enum(["gemini", "gpt-4", "gpt-3.5-turbo"]),
})

export function CreateAgentButton() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      firstMessage: "Hello! How can I assist you today?",
      systemPrompt: "You are a helpful AI voice assistant. Be concise, friendly, and provide accurate information.",
      voiceId: "EXAVITQu4vr4xnSDxMaL", // Default ElevenLabs voice
      languageModel: "gemini",
    },
  })
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/vapi/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create agent")
      }
      
      toast.success("Agent created successfully")
      setOpen(false)
      router.push(`/agents/${data.agent.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating agent:", error)
      toast.error("Failed to create agent")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // When closing the dialog, pause any playing audio
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusIcon className="w-4 h-4" /> New Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create New AI Voice Agent</DialogTitle>
          <DialogDescription>
            Configure your AI voice assistant with a name, voice, and personality.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <div className="gap-4 grid grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sales Assistant" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique name for your AI agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="languageModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Model</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The AI model powering your agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="This agent handles customer inquiries about products and services." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the agent&apos;s purpose
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
                      placeholder="Hello! How can I assist you today?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The first message the agent will say when called
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="You are a helpful customer service AI. Respond in a friendly, professional manner." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Instructions defining the agent&apos;s behavior and knowledge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="voiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice</FormLabel>
                  <div className="space-y-3">
                    {voiceOptions.map((voice) => (
                      <div 
                        key={voice.id}
                        className={`flex items-center justify-between rounded-md border p-3 ${
                          field.value === voice.id ? 'bg-primary/5 border-primary' : ''
                        }`}
                      >
                        <label className="flex flex-1 items-center cursor-pointer">
                          <input
                            type="radio"
                            className="sr-only"
                            value={voice.id}
                            checked={field.value === voice.id}
                            onChange={() => field.onChange(voice.id)}
                          />
                          <span>{voice.name}</span>
                        </label>
                        
                        <VoicePreview 
                          voiceId={voice.id}
                          compact={true}
                        />
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select the voice for your AI agent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 border-primary border-t-2 border-solid rounded-full w-4 h-4 animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  "Create Agent"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 