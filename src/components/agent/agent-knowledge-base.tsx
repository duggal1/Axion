"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { FileUploader } from "@/components/ui/file-uploader"
import { Loader2Icon, SearchIcon, PlusIcon, FileIcon, Trash2Icon, FileTextIcon } from "lucide-react"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
}

interface AgentKnowledgeBaseProps {
  agentId: string
}

export function AgentKnowledgeBase({ agentId }: AgentKnowledgeBaseProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real app, you would fetch this from the API
        // For now, use mock data
        const mockDocuments: Document[] = [
          {
            id: "1",
            name: "product_catalog.pdf",
            type: "pdf",
            size: "2.4 MB",
            uploadedAt: "2023-10-01T14:30:45Z"
          },
          {
            id: "2",
            name: "faq.txt",
            type: "txt",
            size: "45 KB",
            uploadedAt: "2023-09-15T11:20:15Z"
          },
          {
            id: "3",
            name: "support_procedures.docx",
            type: "docx",
            size: "1.2 MB",
            uploadedAt: "2023-10-10T16:45:30Z"
          }
        ]
        
        setDocuments(mockDocuments)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast.error("Failed to load documents")
        setIsLoading(false)
      }
    }
    
    fetchDocuments()
  }, [agentId])
  
  const handleUpload = async (files: File[] | FileList) => {
    setIsUploading(true)
    
    try {
      // In a real app, you would call your API to upload the files
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add the new documents to the list
      const fileArray = Array.from(files);
      const newDocuments = fileArray.map((file, index) => ({
        id: `new-${index}`,
        name: file.name,
        type: file.name.split('.').pop() || '',
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString()
      }))
      
      setDocuments([...documents, ...newDocuments])
      setShowUploadDialog(false)
      toast.success(`${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully`)
    } catch (error) {
      console.error("Error uploading documents:", error)
      toast.error("Failed to upload documents")
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDeleteDocument = async (documentId: string) => {
    try {
      // In a real app, you would call your API to delete the document
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove the document from the list
      setDocuments(documents.filter(doc => doc.id !== documentId))
      toast.success("Document deleted successfully")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    }
  }
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }
  
  const getFileIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'pdf':
        return <FileTextIcon className="w-5 h-5 text-red-500" />
      case 'txt':
        return <FileTextIcon className="w-5 h-5 text-blue-500" />
      case 'docx':
      case 'doc':
        return <FileTextIcon className="w-5 h-5 text-indigo-500" />
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />
    }
  }
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Upload documents to provide your agent with relevant information
              </CardDescription>
            </div>
            
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 w-4 h-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>
                    Upload documents to enhance your agents knowledge. Supported formats: PDF, TXT, DOCX, MD.
                  </DialogDescription>
                </DialogHeader>
                
                <FileUploader
                  onUpload={handleUpload}
                  acceptedFileTypes={{ 
                    'application/pdf': ['.pdf'],
                    'text/plain': ['.txt'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                    'text/markdown': ['.md']
                  }}
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024} // 10MB
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUploadDialog(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="py-10 border border-dashed rounded-lg text-center">
              <FileIcon className="mx-auto w-10 h-10 text-gray-400" />
              <h3 className="mt-2 font-medium text-gray-900 text-sm">No documents</h3>
              <p className="mt-1 text-gray-500 text-sm">
                {searchQuery ? "No documents match your search" : "Upload documents to enhance your agent's knowledge"}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <Button
                    onClick={() => setShowUploadDialog(true)}
                    variant="outline"
                  >
                    <PlusIcon className="mr-2 w-4 h-4" />
                    Upload Document
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="divide-y">
                {filteredDocuments.map((document) => (
                  <div 
                    key={document.id}
                    className="flex justify-between items-center hover:bg-gray-50 p-4"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(document.type)}
                      <div>
                        <p className="font-medium text-sm">{document.name}</p>
                        <p className="text-gray-500 text-xs">
                          {document.size} • Uploaded on {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <Trash2Icon className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 