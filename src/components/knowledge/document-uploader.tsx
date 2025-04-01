"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import {
  Upload as UploadIcon,
  File as FileIcon,
  X as XIcon,
  AlertCircle as AlertIcon,
  CheckCircle as CheckIcon,
  Loader2 as LoaderIcon,
  FileText as FileTextIcon,
  FilePdf as PdfIcon,
  FileSpreadsheet as SpreadsheetIcon,
  Link as LinkIcon,
  Plus as PlusIcon
} from "lucide-react"
import { cn } from "@/lib/cn"

interface DocumentUploaderProps {
  knowledgeBaseId?: string
  className?: string
}

type FileStatus = "queued" | "uploading" | "processing" | "complete" | "error"

interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: FileStatus
  errorMessage?: string
}

export function DocumentUploader({ knowledgeBaseId, className }: DocumentUploaderProps) {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUrlMode, setIsUrlMode] = useState(false)
  const [url, setUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    
    addFiles(selectedFiles)
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  const addFiles = (selectedFiles: FileList) => {
    const newFiles: FileUpload[] = Array.from(selectedFiles).map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "queued"
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    // Automatically start uploading the files
    newFiles.forEach(file => {
      simulateFileUpload(file.id)
    })
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length === 0) return
    
    addFiles(droppedFiles)
  }
  
  const removeFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId))
  }
  
  const simulateFileUpload = (fileId: string) => {
    // Update status to uploading
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, status: "uploading" } 
          : file
      )
    )
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prev => {
        const updatedFiles = prev.map(file => {
          if (file.id === fileId && file.status === "uploading") {
            const newProgress = Math.min(file.progress + 10, 100)
            
            // When upload is complete, change status to processing
            if (newProgress === 100) {
              clearInterval(interval)
              
              // Simulate processing
              setTimeout(() => {
                setFiles(prevFiles => 
                  prevFiles.map(f => 
                    f.id === fileId 
                      ? { ...f, status: Math.random() > 0.9 ? "error" : "complete", errorMessage: "Failed to process document" } 
                      : f
                  )
                )
                
                if (Math.random() > 0.9) {
                  toast.error(`Error processing ${prev.find(f => f.id === fileId)?.name}`)
                } else {
                  toast.success(`Successfully processed ${prev.find(f => f.id === fileId)?.name}`)
                }
              }, 1500)
              
              return { ...file, progress: newProgress, status: "processing" }
            }
            
            return { ...file, progress: newProgress }
          }
          return file
        })
        
        return updatedFiles
      })
    }, 300)
  }
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    
    // Create a file object for the URL
    const urlFile: FileUpload = {
      id: `url-${Date.now()}`,
      name: url,
      size: 0,
      type: "url",
      progress: 0,
      status: "queued"
    }
    
    setFiles(prev => [...prev, urlFile])
    simulateFileUpload(urlFile.id)
    setUrl("")
  }
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <PdfIcon className="w-4 h-4 text-red-500" />
    } else if (
      fileType.includes("spreadsheet") || 
      fileType.includes("excel") || 
      fileType.includes("csv")
    ) {
      return <SpreadsheetIcon className="w-4 h-4 text-green-500" />
    } else if (fileType === "url") {
      return <LinkIcon className="w-4 h-4 text-blue-500" />
    } else {
      return <FileTextIcon className="w-4 h-4 text-blue-500" />
    }
  }
  
  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <LoaderIcon className="w-4 h-4 animate-spin" />
      case "complete":
        return <CheckIcon className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertIcon className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="font-serif font-medium text-lg">Upload Documents</CardTitle>
        <CardDescription>
          Upload documents to your knowledge base for AI voice agents to access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={isUrlMode ? "outline" : "default"}
            size="sm"
            onClick={() => setIsUrlMode(false)}
          >
            <UploadIcon className="mr-2 w-4 h-4" />
            File Upload
          </Button>
          <Button
            variant={isUrlMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsUrlMode(true)}
          >
            <LinkIcon className="mr-2 w-4 h-4" />
            URL Import
          </Button>
        </div>
        
        {isUrlMode ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="flex bg-background file:bg-transparent disabled:opacity-50 shadow-sm px-3 py-1 border border-input file:border-0 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full h-9 file:font-medium placeholder:text-muted-foreground text-sm file:text-sm transition-colors disabled:cursor-not-allowed"
              />
              <Button type="submit" size="sm">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-gray-500 text-xs">
              Enter a URL to a document or webpage to import its content
            </div>
          </form>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-md p-6 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-gray-300"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <UploadIcon className="mx-auto w-10 h-10 text-gray-400" />
            <div className="mt-3 font-medium text-sm">
              Drag & drop files here or <Button variant="link" className="p-0 h-auto" onClick={() => fileInputRef.current?.click()}>browse</Button>
            </div>
            <div className="mt-1 text-gray-500 text-xs">
              Support for PDF, Word, CSV, Excel and text files up to 10MB
            </div>
          </div>
        )}
        
        {files.length > 0 && (
          <div className="border rounded-md divide-y">
            {files.map(file => (
              <div key={file.id} className="flex items-center p-3">
                <div className="mr-3">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm truncate">
                      {file.type === "url" ? file.name : file.name.split(".").slice(0, -1).join(".")}
                    </div>
                    <div className="flex items-center ml-2">
                      {file.status !== "queued" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="mr-1">
                                {getStatusIcon(file.status)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {file.status === "uploading" && "Uploading..."}
                              {file.status === "processing" && "Processing..."}
                              {file.status === "complete" && "Successfully processed"}
                              {file.status === "error" && file.errorMessage}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    {file.type !== "url" && (
                      <div className="mr-2 text-gray-500 text-xs">
                        {file.name.split(".").pop()?.toUpperCase()} • {formatFileSize(file.size)}
                      </div>
                    )}
                    {(file.status === "uploading" || file.status === "processing") && (
                      <div className="flex-1">
                        <Progress value={file.progress} className="h-1.5" />
                      </div>
                    )}
                    {file.status === "complete" && (
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-xs">
                        Completed
                      </Badge>
                    )}
                    {file.status === "error" && (
                      <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700 text-xs">
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 