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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Plus as PlusIcon,
  Loader2 as LoaderIcon,
  Database as DatabaseIcon,
  Upload as UploadIcon
} from "lucide-react"
import { toast } from "sonner"

// Schema for knowledge base form
const knowledgeBaseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  isPublic: z.boolean().default(false),
  vectorDb: z.enum(["pinecone", "qdrant", "weaviate"], {
    required_error: "Please select a vector database",
  })
})

type KnowledgeBaseValues = z.infer<typeof knowledgeBaseSchema>

export function CreateKnowledgeBaseButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  // Initialize form
  const form = useForm<KnowledgeBaseValues>({
    resolver: zodResolver(knowledgeBaseSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      vectorDb: "pinecone",
    },
  })
  
  const onSubmit = async (data: KnowledgeBaseValues) => {
    setIsCreating(true)
    
    try {
      // In a real app, you would send this to your API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log("Creating knowledge base:", data)
      toast.success("Knowledge base created successfully")
      
      // Reset form and close dialog
      form.reset()
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating knowledge base:", error)
      toast.error("Failed to create knowledge base")
    } finally {
      setIsCreating(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 w-4 h-4" />
          Create Knowledge Base
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
          <DialogDescription>
            Create a new knowledge base to store and retrieve information for your AI voice agents
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Product Documentation" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your knowledge base
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
                      placeholder="Describe what kind of information this knowledge base will contain..."
                      className="resize-none"
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="gap-6 grid grid-cols-2">
              <FormField
                control={form.control}
                name="vectorDb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vector Database</FormLabel>
                    <FormControl>
                      <select
                        className="flex bg-background file:bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 border border-input file:border-0 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full h-9 file:font-medium placeholder:text-muted-foreground text-sm file:text-sm transition-colors disabled:cursor-not-allowed"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="pinecone">Pinecone</option>
                        <option value="qdrant">Qdrant</option>
                        <option value="weaviate">Weaviate</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Vector database to use for storing embeddings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row justify-between items-center space-x-2 space-y-0 p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>Public Access</FormLabel>
                      <FormDescription>
                        Allow all agents to access this knowledge base
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-gray-50 p-4 border border-gray-300 border-dashed rounded-md text-center">
              <UploadIcon className="mx-auto w-8 h-8 text-gray-400" />
              <div className="mt-2 text-gray-500 text-sm">
                After creating the knowledge base, you'll be able to upload documents
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <LoaderIcon className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <DatabaseIcon className="mr-2 w-4 h-4" />
                    Create Knowledge Base
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 