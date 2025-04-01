"use client"

import React, { useState, useRef } from "react"
import { FileIcon, UploadCloudIcon, X, AlertCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib"

interface FileUploaderProps {
  onUpload: (files: FileList | File[]) => void
  acceptedFileTypes?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number // In bytes
  className?: string
}

export function FileUploader({
  onUpload,
  acceptedFileTypes = { 'application/pdf': ['.pdf'] },
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  className
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    validateAndAddFiles(droppedFiles)
  }
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      validateAndAddFiles(selectedFiles)
    }
  }
  
  const validateAndAddFiles = (newFiles: File[]) => {
    const newErrors: string[] = []
    const validFiles: File[] = []
    
    // Check if we'd exceed the max number of files
    if (files.length + newFiles.length > maxFiles) {
      newErrors.push(`You can only upload up to ${maxFiles} files at a time`)
      return
    }
    
    for (const file of newFiles) {
      // Check file size
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds the maximum file size of ${formatBytes(maxSize)}`)
        continue
      }
      
      // Check file type
      const fileType = file.type || getTypeFromExtension(file.name)
      if (!isAcceptedFileType(fileType, file.name)) {
        newErrors.push(`${file.name} has an unsupported file type`)
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length > 0) {
      // Initialize progress for valid files
      const newProgress = { ...uploadProgress }
      validFiles.forEach(file => {
        newProgress[file.name] = 0
      })
      setUploadProgress(newProgress)
      
      // Add valid files
      setFiles(prev => [...prev, ...validFiles])
      
      // Simulate upload progress
      simulateUploadProgress(validFiles)
      
      // Call onUpload with the valid files
      onUpload(validFiles)
    }
    
    setErrors(newErrors)
  }
  
  const isAcceptedFileType = (fileType: string, fileName: string) => {
    // Check MIME type
    if (Object.keys(acceptedFileTypes).includes(fileType)) {
      return true
    }
    
    // Check extension
    const extension = `.${fileName.split('.').pop()?.toLowerCase()}`
    return Object.values(acceptedFileTypes).flat().includes(extension)
  }
  
  const getTypeFromExtension = (fileName: string) => {
    const extension = `.${fileName.split('.').pop()?.toLowerCase()}`
    
    for (const [mimeType, extensions] of Object.entries(acceptedFileTypes)) {
      if (extensions.includes(extension)) {
        return mimeType
      }
    }
    
    return ""
  }
  
  const simulateUploadProgress = (uploadingFiles: File[]) => {
    // Simulate progress for each file
    uploadingFiles.forEach(file => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0
          
          if (currentProgress >= 100) {
            clearInterval(interval)
            return prev
          }
          
          const newProgress = Math.min(currentProgress + Math.random() * 15, 100)
          return { ...prev, [file.name]: newProgress }
        })
      }, 300)
    })
  }
  
  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName))
    
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  }
  
  const acceptedExtensions = Object.values(acceptedFileTypes).flat().join(', ')
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* File Drop Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors text-center",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          "cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          multiple
          accept={Object.values(acceptedFileTypes).flat().join(',')}
          className="hidden"
        />
        
        <UploadCloudIcon className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h3 className="font-medium text-gray-900 text-lg">
          Drag & drop files here
        </h3>
        <p className="mt-2 text-gray-500 text-sm">
          or <span className="font-medium text-blue-600">browse</span> from your computer
        </p>
        <p className="mt-1 text-gray-500 text-sm">
          Supports: {acceptedExtensions}
        </p>
        <p className="mt-1 text-gray-500 text-sm">
          Maximum file size: {formatBytes(maxSize)}
        </p>
      </div>
      
      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 p-4 border border-red-200 rounded-md text-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircleIcon className="w-5 h-5" />
            <h4 className="font-medium">Error{errors.length > 1 ? 's' : ''}</h4>
          </div>
          <ul className="space-y-1 pl-5 text-sm list-disc">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-medium text-sm">Files</h3>
          <div className="border rounded-md divide-y overflow-hidden">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3">
                <div className="flex items-center gap-3">
                  <FileIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="max-w-[200px] font-medium text-sm truncate">{file.name}</div>
                    <div className="text-gray-500 text-xs">{formatBytes(file.size)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {uploadProgress[file.name] < 100 ? (
                    <div className="w-24">
                      <Progress value={uploadProgress[file.name]} />
                    </div>
                  ) : (
                    <span className="font-medium text-green-600 text-xs">Uploaded</span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(file.name)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 