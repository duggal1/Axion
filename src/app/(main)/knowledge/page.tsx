/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect } from "react"
import { 
  PlusIcon, 
  FolderIcon, 
  FileTextIcon, 
  TrashIcon, 
  SearchIcon,
  MoreHorizontalIcon,
  FileIcon 
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/ui/file-uploader"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"

interface KnowledgeBase {
  id: string
  name: string
  description: string | null
  documentCount: number
  createdAt: string
}

interface Document {
  id: string
  name: string
  fileUrl: string
  fileType: string
  size: number
  processed: boolean
  createdAt: string
}

export default function KnowledgeBasePage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKbId, setSelectedKbId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingKb, setIsCreatingKb] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [newKbName, setNewKbName] = useState("")
  const [newKbDescription, setNewKbDescription] = useState("")
  
  // Fetch knowledge bases on initial load
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockKnowledgeBases: KnowledgeBase[] = [
          {
            id: "kb1",
            name: "Product Documentation",
            description: "Official product documentation and user guides",
            documentCount: 12,
            createdAt: new Date(2023, 9, 15).toISOString()
          },
          {
            id: "kb2",
            name: "Sales Materials",
            description: "Sales scripts, pricing information, and competitive analysis",
            documentCount: 5,
            createdAt: new Date(2023, 10, 3).toISOString()
          },
          {
            id: "kb3",
            name: "Legal Documents",
            description: "Terms of service, privacy policy, and other legal documents",
            documentCount: 3,
            createdAt: new Date(2023, 11, 20).toISOString()
          }
        ]
        
        setKnowledgeBases(mockKnowledgeBases)
        
        // Select the first knowledge base by default
        if (mockKnowledgeBases.length > 0) {
          setSelectedKbId(mockKnowledgeBases[0].id)
          await fetchDocuments(mockKnowledgeBases[0].id)
        }
      } catch (error) {
        console.error("Error fetching knowledge bases:", error)
        toast.error("Failed to load knowledge bases")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchKnowledgeBases()
  }, [])
  
  const fetchDocuments = async (kbId: string) => {
    try {
      // In a real app, this would be an API call with the knowledge base ID
      // For now, we'll use mock data
      const mockDocuments: Document[] = [
        {
          id: "doc1",
          name: "Product-Manual-v2.3.pdf",
          fileUrl: "/documents/product-manual.pdf",
          fileType: "pdf",
          size: 2_500_000,
          processed: true,
          createdAt: new Date(2023, 9, 20).toISOString()
        },
        {
          id: "doc2",
          name: "API-Documentation.pdf",
          fileUrl: "/documents/api-docs.pdf",
          fileType: "pdf",
          size: 1_800_000,
          processed: true,
          createdAt: new Date(2023, 10, 5).toISOString()
        },
        {
          id: "doc3",
          name: "Pricing-Sheet-Q4-2023.csv",
          fileUrl: "/documents/pricing.csv",
          fileType: "csv",
          size: 350_000,
          processed: true,
          createdAt: new Date(2023, 11, 1).toISOString()
        },
        {
          id: "doc4",
          name: "Integration-Guide.txt",
          fileUrl: "/documents/integration.txt",
          fileType: "txt",
          size: 120_000,
          processed: false,
          createdAt: new Date(2023, 11, 25).toISOString()
        }
      ]
      
      // Filter documents based on the selected knowledge base
      const filteredDocs = mockDocuments.filter((_, index) => {
        if (kbId === "kb1") return index < 2
        if (kbId === "kb2") return index === 2
        if (kbId === "kb3") return index === 3
        return false
      })
      
      setDocuments(filteredDocs)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Failed to load documents")
    }
  }
  
  const selectKnowledgeBase = async (kbId: string) => {
    setSelectedKbId(kbId)
    await fetchDocuments(kbId)
  }
  
  const createKnowledgeBase = async () => {
    if (!newKbName.trim()) {
      toast.error("Please enter a name for the knowledge base")
      return
    }
    
    setIsCreatingKb(true)
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate creating a knowledge base
      const newKb: KnowledgeBase = {
        id: `kb${knowledgeBases.length + 1}`,
        name: newKbName,
        description: newKbDescription || null,
        documentCount: 0,
        createdAt: new Date().toISOString()
      }
      
      // Add the new knowledge base to the list
      setKnowledgeBases(prev => [...prev, newKb])
      
      // Select the new knowledge base
      setSelectedKbId(newKb.id)
      setDocuments([])
      
      // Close the dialog and reset form
      setCreateDialogOpen(false)
      setNewKbName("")
      setNewKbDescription("")
      
      toast.success("Knowledge base created successfully")
    } catch (error) {
      console.error("Error creating knowledge base:", error)
      toast.error("Failed to create knowledge base")
    } finally {
      setIsCreatingKb(false)
    }
  }
  
  const uploadDocuments = async (files: FileList | File[]) => {
    if (!selectedKbId) {
      toast.error("Please select a knowledge base first")
      return
    }
    
    try {
      // In a real app, this would be an API call to upload files
      // For now, we'll simulate adding the files to the list
      
      const newDocs: Document[] = Array.from(files).map((file, index) => ({
        id: `doc${documents.length + index + 1}`,
        name: file.name,
        fileUrl: URL.createObjectURL(file),
        fileType: file.name.split('.').pop() || "unknown",
        size: file.size,
        processed: false,
        createdAt: new Date().toISOString()
      }))
      
      // Add the new documents to the list
      setDocuments(prev => [...prev, ...newDocs])
      
      // Update the document count for the selected knowledge base
      setKnowledgeBases(prev => 
        prev.map(kb => 
          kb.id === selectedKbId 
            ? { ...kb, documentCount: kb.documentCount + newDocs.length } 
            : kb
        )
      )
      
      // Close the dialog
      setUploadDialogOpen(false)
      
      toast.success(`${newDocs.length} document(s) uploaded successfully`)
      
      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            newDocs.some(newDoc => newDoc.id === doc.id)
              ? { ...doc, processed: true }
              : doc
          )
        )
        
        toast.success("Documents processed and ready for use")
      }, 3000)
    } catch (error) {
      console.error("Error uploading documents:", error)
      toast.error("Failed to upload documents")
    }
  }
  
  const deleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return
    }
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate deletion
      
      // Remove the document from the list
      setDocuments(prev => prev.filter(doc => doc.id !== docId))
      
      // Update the document count for the selected knowledge base
      if (selectedKbId) {
        setKnowledgeBases(prev => 
          prev.map(kb => 
            kb.id === selectedKbId 
              ? { ...kb, documentCount: Math.max(0, kb.documentCount - 1) } 
              : kb
          )
        )
      }
      
      toast.success("Document deleted successfully")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    }
  }
  
  const deleteKnowledgeBase = async (kbId: string) => {
    if (!confirm("Are you sure you want to delete this knowledge base? All documents will be permanently removed.")) {
      return
    }
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate deletion
      
      // Remove the knowledge base from the list
      setKnowledgeBases(prev => prev.filter(kb => kb.id !== kbId))
      
      // If the deleted knowledge base was selected, select the first available
      if (selectedKbId === kbId) {
        const remainingKbs = knowledgeBases.filter(kb => kb.id !== kbId)
        if (remainingKbs.length > 0) {
          setSelectedKbId(remainingKbs[0].id)
          await fetchDocuments(remainingKbs[0].id)
        } else {
          setSelectedKbId(null)
          setDocuments([])
        }
      }
      
      toast.success("Knowledge base deleted successfully")
    } catch (error) {
      console.error("Error deleting knowledge base:", error)
      toast.error("Failed to delete knowledge base")
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileTextIcon className="w-5 h-5 text-red-500" />
      case 'csv':
        return <FileTextIcon className="w-5 h-5 text-green-500" />
      case 'txt':
        return <FileTextIcon className="w-5 h-5 text-blue-500" />
      case 'json':
        return <FileTextIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />
    }
  }
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="mx-auto px-4 sm:px-6 py-10 max-w-7xl container">
      <div className="mb-8">
        <h1 className="font-serif font-medium text-gray-900 text-4xl">Knowledge Base</h1>
        <p className="mt-2 text-gray-500">Manage your AI assistants knowledge sources</p>
      </div>
      
      <div className="gap-6 grid grid-cols-12">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="font-serif font-medium text-lg">Knowledge Sources</CardTitle>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 h-8">
                      <PlusIcon className="w-4 h-4" /> New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-serif">Create Knowledge Base</DialogTitle>
                      <DialogDescription>
                        Create a new collection of documents your AI can reference
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="kb-name">Name</Label>
                        <Input
                          id="kb-name"
                          placeholder="e.g., Product Documentation"
                          value={newKbName}
                          onChange={(e) => setNewKbName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="kb-description">Description (optional)</Label>
                        <Textarea
                          id="kb-description"
                          placeholder="What kind of information will this knowledge base contain?"
                          value={newKbDescription}
                          onChange={(e) => setNewKbDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={createKnowledgeBase}
                        disabled={isCreatingKb || !newKbName.trim()}
                      >
                        {isCreatingKb ? "Creating..." : "Create Knowledge Base"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {knowledgeBases.length === 0 ? (
                  <div className="py-8 text-center">
                    <FolderIcon className="mx-auto w-12 h-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">No knowledge bases found</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      Create Knowledge Base
                    </Button>
                  </div>
                ) : (
                  knowledgeBases.map((kb) => (
                    <div
                      key={kb.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedKbId === kb.id ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => selectKnowledgeBase(kb.id)}
                    >
                      <div className="flex items-center gap-3">
                        <FolderIcon className={`w-5 h-5 ${
                          selectedKbId === kb.id ? "text-blue-600" : "text-gray-400"
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{kb.name}</div>
                          <div className="text-gray-500 text-xs">{kb.documentCount} documents</div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-8 h-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontalIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteKnowledgeBase(kb.id)
                            }}
                          >
                            <TrashIcon className="mr-2 w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Content */}
        <div className="col-span-12 lg:col-span-9">
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="font-serif font-medium text-lg">
                    {selectedKbId 
                      ? knowledgeBases.find(kb => kb.id === selectedKbId)?.name || "Documents" 
                      : "Documents"
                    }
                  </CardTitle>
                  <CardDescription>
                    {selectedKbId
                      ? knowledgeBases.find(kb => kb.id === selectedKbId)?.description || "Upload documents to create a knowledge base"
                      : "Select a knowledge base to view documents"
                    }
                  </CardDescription>
                </div>
                
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!selectedKbId} className="shrink-0">
                      <PlusIcon className="mr-2 w-4 h-4" /> Upload Documents
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="font-serif">Upload Documents</DialogTitle>
                      <DialogDescription>
                        Add documents to your knowledge base that your AI assistant can reference
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <FileUploader
                        onUpload={uploadDocuments}
                        acceptedFileTypes={{
                          'application/pdf': ['.pdf'],
                          'text/plain': ['.txt'],
                          'text/csv': ['.csv'],
                          'application/json': ['.json']
                        }}
                        maxFiles={5}
                        maxSize={10 * 1024 * 1024} // 10MB
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="mt-4">
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
            </CardHeader>
            <CardContent className="pt-2">
              {!selectedKbId ? (
                <div className="py-12 text-center">
                  <FileTextIcon className="mx-auto w-16 h-16 text-gray-300" />
                  <p className="mt-4 font-medium text-gray-600">No knowledge base selected</p>
                  <p className="mt-2 text-gray-500">
                    Select a knowledge base from the sidebar or create a new one
                  </p>
                </div>
              ) : documents.length === 0 ? (
                <div className="py-12 text-center">
                  <FileTextIcon className="mx-auto w-16 h-16 text-gray-300" />
                  <p className="mt-4 font-medium text-gray-600">No documents found</p>
                  <p className="mt-2 text-gray-500">
                    Upload documents to make them available to your AI assistant
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <PlusIcon className="mr-2 w-4 h-4" /> Upload Documents
                  </Button>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="py-12 text-center">
                  <SearchIcon className="mx-auto w-16 h-16 text-gray-300" />
                  <p className="mt-4 font-medium text-gray-600">No matching documents</p>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search query
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">Uploaded</th>
                        <th className="px-4 py-3 font-medium text-gray-500 text-xs text-right uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {getFileTypeIcon(doc.fileType)}
                              <span className="font-medium text-sm">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge variant="outline" className="uppercase">{doc.fileType}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                            {formatFileSize(doc.size)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {doc.processed ? (
                              <Badge className="bg-green-100 border-transparent text-green-800">Processed</Badge>
                            ) : (
                              <Badge variant="outline" className="animate-pulse">Processing</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                            {format(new Date(doc.createdAt), "MMM d, yyyy")}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-red-600"
                              onClick={() => deleteDocument(doc.id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 