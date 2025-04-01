"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { 
  Search as SearchIcon, 
  MoreVertical as MoreIcon,
  FileText as FileTextIcon,
  FilePdf as PdfIcon,
  FileSpreadsheet as SpreadsheetIcon,
  Link as LinkIcon,
  Trash as TrashIcon,
  Download as DownloadIcon,
  ArrowDownUp as SortIcon,
  AlertCircle as AlertIcon,
  Loader2 as LoaderIcon
} from "lucide-react"
import { cn } from "@/lib/cn"
import { format } from "date-fns"
import { toast } from "sonner"

interface Document {
  id: string
  name: string
  type: string
  size: number
  chunks: number
  uploadedAt: Date
  status: "processed" | "failed" | "processing"
  sourceUrl?: string
}

interface DocumentListProps {
  knowledgeBaseId?: string
  className?: string
}

export function DocumentList({ knowledgeBaseId, className }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  useEffect(() => {
    fetchDocuments()
  }, [knowledgeBaseId])
  
  const fetchDocuments = async () => {
    setIsLoading(true)
    
    try {
      // In a real app, you would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockDocuments: Document[] = [
        {
          id: "doc-1",
          name: "Product Marketing Guide 2023",
          type: "pdf",
          size: 2456000,
          chunks: 42,
          uploadedAt: new Date(2023, 10, 5),
          status: "processed"
        },
        {
          id: "doc-2",
          name: "Customer Support Guidelines",
          type: "docx",
          size: 890000,
          chunks: 18,
          uploadedAt: new Date(2023, 10, 10),
          status: "processed"
        },
        {
          id: "doc-3",
          name: "Sales Training Manual",
          type: "pdf",
          size: 5600000,
          chunks: 76,
          uploadedAt: new Date(2023, 9, 22),
          status: "processed"
        },
        {
          id: "doc-4",
          name: "Quarterly Sales Data",
          type: "xlsx",
          size: 345000,
          chunks: 12,
          uploadedAt: new Date(2023, 11, 1),
          status: "processed"
        },
        {
          id: "doc-5",
          name: "Annual Financial Report",
          type: "pdf",
          size: 8900000,
          chunks: 104,
          uploadedAt: new Date(2023, 8, 15),
          status: "processed"
        },
        {
          id: "doc-6",
          name: "Company Website Content",
          type: "url",
          chunks: 28,
          size: 0,
          uploadedAt: new Date(2023, 11, 5),
          status: "processing",
          sourceUrl: "https://example.com"
        },
        {
          id: "doc-7",
          name: "Competitor Analysis",
          type: "pdf",
          size: 1230000,
          chunks: 0,
          uploadedAt: new Date(2023, 11, 6),
          status: "failed"
        }
      ]
      
      setDocuments(mockDocuments)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Failed to load documents")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteDocument = (document: Document) => {
    setDocumentToDelete(document)
  }
  
  const confirmDelete = async () => {
    if (!documentToDelete) return
    
    try {
      // In a real app, you would call your API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id))
      toast.success(`"${documentToDelete.name}" deleted successfully`)
      setDocumentToDelete(null)
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error("Failed to delete document")
    }
  }
  
  const handleSort = (column: "name" | "date" | "size") => {
    if (sortBy === column) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortDirection("desc")
    }
  }
  
  const getFileIcon = (fileType: string) => {
    if (fileType === "pdf") {
      return <PdfIcon className="w-4 h-4 text-red-500" />
    } else if (fileType === "xlsx" || fileType === "csv") {
      return <SpreadsheetIcon className="w-4 h-4 text-green-500" />
    } else if (fileType === "url") {
      return <LinkIcon className="w-4 h-4 text-blue-500" />
    } else {
      return <FileTextIcon className="w-4 h-4 text-blue-500" />
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "-"
    
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }
  
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy")
  }
  
  // Filter and sort documents
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return doc.name.toLowerCase().includes(query) || 
        doc.type.toLowerCase().includes(query)
    })
    .sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1
      
      switch (sortBy) {
        case "name":
          return modifier * a.name.localeCompare(b.name)
        case "size":
          return modifier * (a.size - b.size)
        case "date":
        default:
          return modifier * (a.uploadedAt.getTime() - b.uploadedAt.getTime())
      }
    })
  
  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "processed":
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Processed</Badge>
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">Processing</Badge>
      case "failed":
        return <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">Failed</Badge>
      default:
        return null
    }
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="font-serif font-medium text-lg">Knowledge Base Documents</CardTitle>
        <CardDescription>
          View and manage documents in your knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4 w-full max-w-sm">
          <SearchIcon className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderIcon className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredAndSortedDocuments.length === 0 ? (
          <div className="py-12 border rounded-md text-center">
            <div className="flex flex-col items-center gap-2">
              <FileTextIcon className="w-10 h-10 text-gray-300" />
              <h3 className="mt-2 font-medium text-lg">No documents found</h3>
              <p className="mt-1 text-gray-500 text-sm">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Upload documents to get started"}
              </p>
            </div>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%] cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Document
                      {sortBy === "name" && (
                        <SortIcon 
                          className={cn(
                            "w-4 h-4 ml-1",
                            sortDirection === "desc" ? "rotate-180" : ""
                          )} 
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("size")}>
                    <div className="flex items-center">
                      Size
                      {sortBy === "size" && (
                        <SortIcon 
                          className={cn(
                            "w-4 h-4 ml-1",
                            sortDirection === "desc" ? "rotate-180" : ""
                          )} 
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Uploaded
                      {sortBy === "date" && (
                        <SortIcon 
                          className={cn(
                            "w-4 h-4 ml-1",
                            sortDirection === "desc" ? "rotate-180" : ""
                          )} 
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getFileIcon(document.type)}
                        <span className="ml-2 truncate">{document.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs uppercase">{document.type}</TableCell>
                    <TableCell>
                      {document.status === "processing" ? (
                        <div className="flex items-center">
                          <LoaderIcon className="mr-1 w-3 h-3 text-blue-500 animate-spin" />
                          <span>Processing</span>
                        </div>
                      ) : document.status === "failed" ? (
                        <div className="flex items-center text-red-600">
                          <AlertIcon className="mr-1 w-3 h-3" />
                          <span>Failed</span>
                        </div>
                      ) : (
                        document.chunks
                      )}
                    </TableCell>
                    <TableCell>{formatFileSize(document.size)}</TableCell>
                    <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreIcon className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {document.status === "processed" && (
                            <DropdownMenuItem className="cursor-pointer">
                              <DownloadIcon className="mr-2 w-4 h-4" />
                              Download
                            </DropdownMenuItem>
                          )}
                          {document.sourceUrl && (
                            <DropdownMenuItem className="cursor-pointer">
                              <LinkIcon className="mr-2 w-4 h-4" />
                              View Source
                            </DropdownMenuItem>
                          )}
                          {document.status === "failed" && (
                            <DropdownMenuItem className="cursor-pointer">
                              <AlertIcon className="mr-2 w-4 h-4" />
                              View Error
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDeleteDocument(document)}
                          >
                            <TrashIcon className="mr-2 w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{documentToDelete?.name}"? 
                This will permanently remove the document from your knowledge base.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDocumentToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
} 