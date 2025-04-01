"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PhoneCallIcon, Settings2Icon, BarChart4Icon, PhoneIcon } from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  description: string | null
  avatar: string | null
  isActive: boolean
  callCount: number
  lastActive: string
}

export function AgentCards() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // In a real app, fetch agents from API
    // This is mock data
    setAgents([
      {
        id: "1",
        name: "Sales Assistant",
        description: "Handles product inquiries and sales calls",
        avatar: null,
        isActive: true,
        callCount: 45,
        lastActive: "2 hours ago"
      },
      {
        id: "2",
        name: "Customer Support",
        description: "Provides technical support and troubleshooting",
        avatar: null,
        isActive: true,
        callCount: 78,
        lastActive: "5 minutes ago"
      },
      {
        id: "3",
        name: "Appointment Scheduler",
        description: "Books and manages appointments",
        avatar: null,
        isActive: false,
        callCount: 23,
        lastActive: "3 days ago"
      }
    ])
    setIsLoading(false)
  }, [])
  
  if (isLoading) {
    return <div className="py-10 text-gray-500 text-center">Loading agents...</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-serif font-medium text-gray-900 text-xl">Your Voice Agents</h2>
        <Link href="/agents">
          <Button variant="outline" className="text-sm">
            View All
          </Button>
        </Link>
      </div>
      
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-white shadow-sm border border-gray-100 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="bg-gray-100 w-8 h-8">
                    <AvatarFallback className="text-gray-600 text-sm">
                      {agent.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-serif font-medium text-md">{agent.name}</CardTitle>
                </div>
                <Badge variant={agent.isActive ? "default" : "outline"} className="text-xs">
                  {agent.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between items-center py-1 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <PhoneCallIcon className="w-3 h-3" /> 
                  <span className="text-xs">{agent.callCount} calls</span>
                </div>
                <div className="text-gray-400 text-xs">Last active: {agent.lastActive}</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Link href={`/agents/${agent.id}`}>
                <Button variant="ghost" size="sm" className="px-2 h-8 text-xs">
                  <Settings2Icon className="mr-1 w-3 h-3" /> Configure
                </Button>
              </Link>
              <Link href={`/agents/${agent.id}/analytics`}>
                <Button variant="ghost" size="sm" className="px-2 h-8 text-xs">
                  <BarChart4Icon className="mr-1 w-3 h-3" /> Analytics
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="px-2 h-8 text-xs">
                <PhoneIcon className="mr-1 w-3 h-3" /> Call
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Link href="/agents/new">
          <Card className="flex justify-center items-center bg-white shadow-sm border border-gray-200 hover:border-gray-300 border-dashed h-full transition-colors cursor-pointer">
            <CardContent className="py-8 text-center">
              <div className="flex justify-center items-center bg-gray-50 mx-auto mb-3 rounded-full w-12 h-12">
                <span className="text-gray-400 text-2xl">+</span>
              </div>
              <p className="font-serif font-medium text-gray-900 text-sm">Create New Agent</p>
              <p className="mt-1 text-gray-500 text-xs">Set up a new AI voice assistant</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
} 