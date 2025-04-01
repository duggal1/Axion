/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  Tag as TagIcon,
  X as XIcon
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"


// Schema for prompt form
const promptSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  content: z
    .string()
    .min(10, "Prompt content must be at least 10 characters")
    .max(2000, "Prompt content cannot exceed 2000 characters"),
  category: z.enum(["conversation", "system", "welcome", "custom"], {
    required_error: "Please select a category",
  }),
  tags: z.array(z.string()).optional(),
})

type PromptValues = z.infer<typeof promptSchema>

export function CreatePromptButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [tagInput, setTagInput] = useState("")
  
  // Initialize form
  const form = useForm<PromptValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "conversation",
      tags: [],
    },
  })
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return
    
    const tag = tagInput.trim().toLowerCase()
    const currentTags = form.getValues("tags") || []
    
    // Prevent duplicate tags
    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag])
    }
    
    setTagInput("")
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || []
    form.setValue(
      "tags", 
      currentTags.filter(tag => tag !== tagToRemove)
    )
  }
  
  const onSubmit = async (data: PromptValues) => {
    setIsCreating(true)
    
    try {
      // In a real app, you would send this to your API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Prompt created successfully")
      
      // Reset form and close dialog
      form.reset()
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating prompt:", error)
      toast.error("Failed to create prompt")
    } finally {
      setIsCreating(false)
    }
  }
  
  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "conversation":
        return "Messages the agent can use during conversations with users"
      case "system":
        return "Instructions that define the agent's behavior and capabilities"
      case "welcome":
        return "Initial greeting messages when a call begins"
      case "custom":
        return "Custom prompts for specific use cases"
      default:
        return ""
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 w-4 h-4" />
          Create Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
          <DialogDescription>
            Create a reusable prompt template to use with your AI voice agents
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Customer Greeting" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for the prompt
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="gap-4 grid grid-cols-2"
                    >
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="conversation" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-normal">Conversation</FormLabel>
                          <FormDescription className="text-xs">
                            For agent conversations
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="system" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-normal">System</FormLabel>
                          <FormDescription className="text-xs">
                            Agent behavior instructions
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="welcome" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-normal">Welcome</FormLabel>
                          <FormDescription className="text-xs">
                            Initial greeting messages
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="custom" />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-normal">Custom</FormLabel>
                          <FormDescription className="text-xs">
                            For specific use cases
                          </FormDescription>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    {getCategoryDescription(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the prompt content here..."
                      className="min-h-[120px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Use &#123;&#123;variable&#125;&#125; syntax for dynamic placeholder values
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <div className="relative">
                        <TagIcon className="top-1/2 left-3 absolute w-4 h-4 text-gray-500 -translate-y-1/2" />
                        <Input
                          placeholder="Add tags..."
                          className="pl-9"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={handleAddTag}
                        />
                      </div>
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="mt-0"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {field.value?.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="secondary" 
                        className="gap-1 bg-gray-100 hover:bg-gray-200 text-xs cursor-default"
                      >
                        {tag}
                        <XIcon 
                          className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                    {!field.value?.length && (
                      <span className="text-gray-500 text-sm">No tags added yet</span>
                    )}
                  </div>
                  <FormDescription>
                    Tags help organize and find prompts easily
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                  "Create Prompt"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 