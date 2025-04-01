"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCallIcon, ClockIcon, BarChart4Icon, MessageCircleIcon } from "lucide-react"

export function AgentMetrics() {
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    totalMinutes: 0,
    averageDuration: 0,
    successRate: 0
  })
  
  useEffect(() => {
    // In a real app, fetch metrics from API
    // This is mock data
    setMetrics({
      totalCalls: 124,
      totalMinutes: 453,
      averageDuration: 3.7,
      successRate: 92
    })
  }, [])
  
  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="font-medium text-gray-500 text-sm">Total Calls</CardTitle>
          <PhoneCallIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="font-serif font-bold text-2xl">{metrics.totalCalls}</div>
          <p className="mt-1 text-gray-500 text-xs">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="font-medium text-gray-500 text-sm">Total Minutes</CardTitle>
          <ClockIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="font-serif font-bold text-2xl">{metrics.totalMinutes}</div>
          <p className="mt-1 text-gray-500 text-xs">+8% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="font-medium text-gray-500 text-sm">Avg. Duration</CardTitle>
          <BarChart4Icon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="font-serif font-bold text-2xl">{metrics.averageDuration} min</div>
          <p className="mt-1 text-gray-500 text-xs">-2% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="font-medium text-gray-500 text-sm">Success Rate</CardTitle>
          <MessageCircleIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="font-serif font-bold text-2xl">{metrics.successRate}%</div>
          <p className="mt-1 text-gray-500 text-xs">+4% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
} 