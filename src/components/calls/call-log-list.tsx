/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CallFilter, CallFilters } from "@/components/calls/call-filter"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/cn"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import { 
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CircleAlert as AlertIcon,
  Download as DownloadIcon,
  Play as PlayIcon,
  ArrowDownUp as SortIcon
} from "lucide-react"
import { toast } from "sonner"

export interface CallLog {
  id: string
  fromNumber: string
  toNumber: string
  duration: number // in seconds
  status: "completed" | "failed" | "inProgress" | "missed"
  createdAt: Date
  transcriptAvailable: boolean
  recordingUrl?: string
  transcript?: string
}

export interface CallLogListProps {
  agentId?: string
  initialLogs?: CallLog[]
  className?: string
}

export function CallLogList({ agentId, initialLogs, className }: CallLogListProps) {
  const [callLogs, setCallLogs] = useState<CallLog[]>(initialLogs || [])
  const [isLoading, setIsLoading] = useState(!initialLogs)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
  const [showCallDetails, setShowCallDetails] = useState(false)
  const [filters, setFilters] = useState<CallFilters>({
    dateRange: {
      from: null,
      to: null
    },
    status: ["all"],
    minDuration: null,
    maxDuration: null
  })
  const [sortConfig, setSortConfig] = useState<{ key: keyof CallLog; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  })
  
  useEffect(() => {
    if (!initialLogs) {
      fetchCallLogs()
    }
  }, [agentId, initialLogs])
  
  const fetchCallLogs = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API with the agentId
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock data
      const today = new Date()
      const mockLogs: CallLog[] = Array.from({ length: 50 }, (_, i) => {
        const date = new Date(today)
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        date.setHours(Math.floor(Math.random() * 24))
        date.setMinutes(Math.floor(Math.random() * 60))
        
        const statuses: CallLog["status"][] = ["completed", "failed", "inProgress", "missed"]
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        
        const duration = status === "completed" ? Math.floor(Math.random() * 600) : 0
        
        return {
          id: `call-${i}`,
          fromNumber: `+1${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
          toNumber: `+1${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
          duration,
          status,
          createdAt: date,
          transcriptAvailable: status === "completed" && Math.random() > 0.3
        }
      })
      
      // Sort by date (newest first)
      mockLogs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      
      setCallLogs(mockLogs)
    } catch (error) {
      console.error("Error fetching call logs:", error)
      toast.error("Failed to load call history")
    } finally {
      setIsLoading(false)
    }
  }
  
  const formatPhoneNumber = (phoneNumber: string) => {
    // Format as (XXX) XXX-XXXX for US numbers
    if (phoneNumber.startsWith("+1") && phoneNumber.length === 12) {
      return `(${phoneNumber.substring(2, 5)}) ${phoneNumber.substring(5, 8)}-${phoneNumber.substring(8)}`
    }
    return phoneNumber
  }
  
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "-"
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  const getStatusBadge = (status: CallLog["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Completed</Badge>
      case "failed":
        return <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">Failed</Badge>
      case "inProgress":
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">In Progress</Badge>
      case "missed":
        return <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">Missed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy")
  }
  
  const formatTime = (date: Date) => {
    return format(date, "h:mm a")
  }
  
  const handleFilterChange = (newFilters: CallFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  const handleSort = (key: keyof CallLog) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  // Apply filters and sorting to logs
  const filteredAndSortedLogs = () => {
    // First apply filters
    let result = [...callLogs]
    
    // Filter by status
    if (!filters.status.includes("all")) {
      result = result.filter(log => filters.status.includes(log.status))
    }
    
    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      result = result.filter(log => {
        const callDate = new Date(log.createdAt)
        
        if (filters.dateRange.from && filters.dateRange.to) {
          return isWithinInterval(callDate, {
            start: startOfDay(filters.dateRange.from),
            end: endOfDay(filters.dateRange.to)
          })
        } else if (filters.dateRange.from) {
          return callDate >= startOfDay(filters.dateRange.from)
        } else if (filters.dateRange.to) {
          return callDate <= endOfDay(filters.dateRange.to as Date)
        }
        
        return true
      })
    }
    
    // Filter by duration
    if (filters.minDuration !== null) {
      result = result.filter(log => log.duration >= (filters.minDuration as number))
    }
    
    if (filters.maxDuration !== null) {
      result = result.filter(log => log.duration <= (filters.maxDuration as number))
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const key = sortConfig.key;
      
      // Ensure values exist and handle specific types
      if (key === 'createdAt') {
        return sortConfig.direction === 'asc' 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } 
      
      if (key === 'duration') {
        return sortConfig.direction === 'asc'
          ? a.duration - b.duration
          : b.duration - a.duration;
      }
      
      if (key === 'status') {
        return sortConfig.direction === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      
      // For other string properties
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return sortConfig.direction === 'asc'
          ? (a[key] as string).localeCompare(b[key] as string)
          : (b[key] as string).localeCompare(a[key] as string);
      }
      
      return 0;
    })
    
    return result
  }
  
  const sortedAndFilteredLogs = filteredAndSortedLogs()
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(sortedAndFilteredLogs.length / itemsPerPage)
  
  // Pagination
  const paginatedLogs = sortedAndFilteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  const viewCallDetails = (call: CallLog) => {
    // In a real app, you would fetch transcript and recording URL here
    if (call.transcriptAvailable && !call.transcript) {
      // Mock transcript data
      call.transcript = "Customer: Hi, I'm calling about your services.\n\nAgent: Hello! Thank you for your interest. How can I help you today?\n\nCustomer: I'm interested in your premium plan, but I have a few questions.\n\nAgent: I'd be happy to answer your questions about our premium plan. What would you like to know?\n\nCustomer: What features are included and what's the pricing?\n\nAgent: Our premium plan includes advanced analytics, priority support, and unlimited users. The pricing is $49 per month with an annual subscription or $59 month-to-month. Would you like me to email you a detailed feature comparison?\n\nCustomer: Yes, that would be great.\n\nAgent: Perfect. I've sent the comparison to your email. Is there anything else I can help you with today?\n\nCustomer: No, that's all. Thanks for your help!\n\nAgent: You're welcome! Feel free to call back if you have any other questions. Have a great day!"
      
      // Mock recording URL
      call.recordingUrl = "https://example.com/recordings/call-123.mp3"
    }
    
    setSelectedCall(call)
    setShowCallDetails(true)
  }
  
  const downloadTranscript = () => {
    if (!selectedCall?.transcript) return
    
    const element = document.createElement("a")
    const file = new Blob([selectedCall.transcript], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `transcript-${selectedCall.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    toast.success("Transcript downloaded")
  }
  
  const getSortIndicator = (key: keyof CallLog) => {
    if (sortConfig.key !== key) return null
    
    return (
      <span className={cn(
        "inline-block ml-1 transform transition-transform",
        sortConfig.direction === 'desc' ? "" : "rotate-180"
      )}>
        ▼
      </span>
    )
  }
  
  return (
    <div className={className}>
      <div className="mb-4">
        <CallFilter onFilterChange={handleFilterChange} />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center bg-white border rounded-md h-60">
          <div className="border-4 border-t-blue-600 border-blue-200 rounded-full w-10 h-10 animate-spin" />
        </div>
      ) : sortedAndFilteredLogs.length === 0 ? (
        <div className="bg-white py-12 border rounded-md text-center">
          <PhoneIcon className="mx-auto w-12 h-12 text-gray-300" />
          <h3 className="mt-4 font-medium text-lg">No calls found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px] cursor-pointer" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center">
                      Date {getSortIndicator('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead 
                    className="w-[100px] cursor-pointer" 
                    onClick={() => handleSort('duration')}
                  >
                    <div className="flex items-center">
                      Duration {getSortIndicator('duration')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[110px] cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status {getSortIndicator('status')}
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((call) => (
                  <TableRow 
                    key={call.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewCallDetails(call)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{formatDate(call.createdAt)}</span>
                        <span className="text-gray-500 text-xs">{formatTime(call.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatPhoneNumber(call.fromNumber)}</TableCell>
                    <TableCell>{formatPhoneNumber(call.toNumber)}</TableCell>
                    <TableCell>{formatDuration(call.duration)}</TableCell>
                    <TableCell>{getStatusBadge(call.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNumber: number
                    
                    // Handle showing correct page numbers based on current position
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      
      <AlertDialog open={showCallDetails} onOpenChange={setShowCallDetails}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Call Details</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCall && (
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {formatDate(selectedCall.createdAt)} at {formatTime(selectedCall.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    <span>Duration: {formatDuration(selectedCall.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <PhoneIcon className="w-4 h-4" />
                    <span>From: {formatPhoneNumber(selectedCall.fromNumber)}</span>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {selectedCall && (
            <div className="space-y-4 my-4">
              <div>
                <h3 className="mb-2 font-medium text-sm">Status</h3>
                <div>{getStatusBadge(selectedCall.status)}</div>
              </div>
              
              {selectedCall.status === "failed" && (
                <div className="bg-red-50 p-3 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertIcon className="w-4 h-4" />
                    <span className="font-medium">Call Failed</span>
                  </div>
                  <p className="mt-1 text-red-600 text-sm">
                    The call could not be completed. The customer may have hung up or there might have been a network issue.
                  </p>
                </div>
              )}
              
              {selectedCall.transcriptAvailable && selectedCall.transcript && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">Transcript</h3>
                    <Button variant="outline" size="sm" onClick={downloadTranscript}>
                      <DownloadIcon className="mr-1.5 w-3.5 h-3.5" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 border rounded-md max-h-[300px] overflow-y-auto text-sm whitespace-pre-line">
                    {selectedCall.transcript}
                  </div>
                </div>
              )}
              
              {selectedCall.status === "completed" && selectedCall.recordingUrl && (
                <div>
                  <h3 className="mb-2 font-medium text-sm">Recording</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <PlayIcon className="mr-1.5 w-3.5 h-3.5" />
                      Play Recording
                    </Button>
                    <Button variant="ghost">
                      <DownloadIcon className="mr-1.5 w-3.5 h-3.5" />
                      Download MP3
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="default">
                Call Back
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 