"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { CallStatus } from "@prisma/client"

interface CallLog {
  id: string
  agentId: string
  agent: {
    name: string
    avatar: string | null
  }
  fromNumber: string | null
  toNumber: string | null
  duration: number | null
  status: CallStatus
  createdAt: Date
}

export function RecentCalls() {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // In a real app, fetch calls from API
    // This is mock data
    const mockCalls = [
      {
        id: "1",
        agentId: "1",
        agent: {
          name: "Sales Assistant",
          avatar: null
        },
        fromNumber: "+1 (555) 123-4567",
        toNumber: "+1 (555) 987-6543",
        duration: 180, // 3 minutes
        status: "completed" as CallStatus,
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: "2",
        agentId: "2",
        agent: {
          name: "Customer Support",
          avatar: null
        },
        fromNumber: "+1 (555) 234-5678",
        toNumber: "+1 (555) 876-5432",
        duration: 320, // 5.3 minutes
        status: "completed" as CallStatus,
        createdAt: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        id: "3",
        agentId: "3",
        agent: {
          name: "Appointment Scheduler",
          avatar: null
        },
        fromNumber: "+1 (555) 345-6789",
        toNumber: "+1 (555) 765-4321",
        duration: 60, // 1 minute
        status: "failed" as CallStatus,
        createdAt: new Date(Date.now() - 10800000) // 3 hours ago
      },
      {
        id: "4",
        agentId: "1",
        agent: {
          name: "Sales Assistant",
          avatar: null
        },
        fromNumber: "+1 (555) 456-7890",
        toNumber: "+1 (555) 654-3210",
        duration: 240, // 4 minutes
        status: "completed" as CallStatus,
        createdAt: new Date(Date.now() - 14400000) // 4 hours ago
      },
      {
        id: "5",
        agentId: "2",
        agent: {
          name: "Customer Support",
          avatar: null
        },
        fromNumber: "+1 (555) 567-8901",
        toNumber: "+1 (555) 543-2109",
        duration: null,
        status: "inProgress" as CallStatus,
        createdAt: new Date(Date.now() - 300000) // 5 minutes ago
      }
    ]
    
    setCalls(mockCalls)
    setIsLoading(false)
  }, [])
  
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "—"
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }
  
  const getStatusBadge = (status: CallStatus) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 hover:bg-green-100 text-green-800 text-xs">Completed</Badge>
      case "inProgress":
        return <Badge variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800 text-xs">In Progress</Badge>
      case "failed":
        return <Badge variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200 text-red-800 text-xs">Failed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800 text-xs">Cancelled</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }
  
  if (isLoading) {
    return <div className="py-10 text-gray-500 text-center">Loading calls...</div>
  }
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-serif font-medium text-gray-900 text-xl">Recent Calls</CardTitle>
          <Link href="/calls" className="text-gray-500 hover:text-gray-900 text-sm">
            View all
          </Link>
        </div>
        <CardDescription className="mt-1 text-xs">Recent conversations with your AI voice agents</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Agent</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => (
              <TableRow key={call.id}>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="bg-gray-100 w-7 h-7">
                      <AvatarFallback className="text-gray-600 text-xs">
                        {call.agent.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{call.agent.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm">{call.fromNumber}</TableCell>
                <TableCell className="py-2 text-sm">{call.toNumber}</TableCell>
                <TableCell className="py-2 text-sm">{formatDuration(call.duration)}</TableCell>
                <TableCell className="py-2">{getStatusBadge(call.status)}</TableCell>
                <TableCell className="py-2 text-gray-500 text-sm text-right">
                  {formatDistanceToNow(call.createdAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 