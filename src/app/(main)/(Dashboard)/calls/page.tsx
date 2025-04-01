import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CallLogList } from "@/components/calls/call-log-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PhoneIcon, 
  PhoneCallIcon, 
  PhoneOutgoingIcon, 
  PhoneIncomingIcon,
  ClockIcon,
  BarChart3Icon
} from "lucide-react"

export default function CallsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1 mt-8">
          <div className="@container/main flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center px-6">
              <div>
                <h1 className="font-serif font-medium text-gray-900 text-3xl">Call History</h1>
                <p className="mt-1 text-gray-500">Track and manage all calls across your AI voice agents</p>
              </div>
            </div>
            
            <div className="px-6 pt-2">
              <Tabs defaultValue="all" className="space-y-6">
                <div className="flex justify-between items-end">
                  <TabsList>
                    <TabsTrigger value="all">All Calls</TabsTrigger>
                    <TabsTrigger value="incoming">Incoming</TabsTrigger>
                    <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
                    <TabsTrigger value="missed">Missed Calls</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="space-y-6">
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
                    <StatsCard 
                      title="Total Calls" 
                      value="582"
                      description="Last 30 days"
                      icon={<PhoneIcon className="w-5 h-5 text-blue-500" />}
                      trend={+12.5}
                    />
                    <StatsCard 
                      title="Completed" 
                      value="493"
                      description="84.7% completion rate"
                      icon={<PhoneCallIcon className="w-5 h-5 text-green-500" />}
                      trend={+8.2}
                    />
                    <StatsCard 
                      title="Average Duration" 
                      value="4:23"
                      description="minutes:seconds"
                      icon={<ClockIcon className="w-5 h-5 text-amber-500" />}
                      trend={-0.5}
                    />
                    <StatsCard 
                      title="Failed Calls" 
                      value="89"
                      description="15.3% failure rate"
                      icon={<BarChart3Icon className="w-5 h-5 text-red-500" />}
                      trend={+3.1}
                      trendNegative
                    />
                  </div>
                  <CallLogList />
                </TabsContent>
                
                <TabsContent value="incoming">
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-6">
                    <StatsCard 
                      title="Incoming Calls" 
                      value="328"
                      description="Last 30 days"
                      icon={<PhoneIncomingIcon className="w-5 h-5 text-blue-500" />}
                      trend={+5.8}
                    />
                    <StatsCard 
                      title="Completed" 
                      value="287"
                      description="87.5% completion rate"
                      icon={<PhoneCallIcon className="w-5 h-5 text-green-500" />}
                      trend={+2.1}
                    />
                    <StatsCard 
                      title="Average Duration" 
                      value="6:05"
                      description="minutes:seconds"
                      icon={<ClockIcon className="w-5 h-5 text-amber-500" />}
                      trend={+1.2}
                    />
                  </div>
                  <CallLogList />
                </TabsContent>
                
                <TabsContent value="outgoing">
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-6">
                    <StatsCard 
                      title="Outgoing Calls" 
                      value="254"
                      description="Last 30 days"
                      icon={<PhoneOutgoingIcon className="w-5 h-5 text-indigo-500" />}
                      trend={+18.3}
                    />
                    <StatsCard 
                      title="Completed" 
                      value="206"
                      description="81.1% completion rate"
                      icon={<PhoneCallIcon className="w-5 h-5 text-green-500" />}
                      trend={+14.5}
                    />
                    <StatsCard 
                      title="Average Duration" 
                      value="3:12"
                      description="minutes:seconds"
                      icon={<ClockIcon className="w-5 h-5 text-amber-500" />}
                      trend={-0.8}
                    />
                  </div>
                  <CallLogList />
                </TabsContent>
                
                <TabsContent value="missed">
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mb-6">
                    <StatsCard 
                      title="Missed Calls" 
                      value="37"
                      description="Last 30 days"
                      icon={<PhoneIcon className="w-5 h-5 text-red-500" />}
                      trend={-5.2}
                      trendReversed
                    />
                    <StatsCard 
                      title="Miss Rate" 
                      value="6.4%"
                      description="of total calls"
                      icon={<BarChart3Icon className="w-5 h-5 text-orange-500" />}
                      trend={-2.1}
                      trendReversed
                    />
                  </div>
                  <CallLogList />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: number
  trendNegative?: boolean
  trendReversed?: boolean
}

function StatsCard({ title, value, description, icon, trend, trendNegative, trendReversed }: StatsCardProps) {
  // If trendReversed is true, a negative trend is actually good (shown in green)
  const isPositiveTrend = trendReversed ? trend < 0 : trend > 0
  const showAsTrendNegative = trendReversed ? !trendNegative : trendNegative
  
  const trendColor = showAsTrendNegative 
    ? (isPositiveTrend ? "text-red-600" : "text-green-600")
    : (isPositiveTrend ? "text-green-600" : "text-red-600")
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="font-medium text-gray-500 text-sm">{title}</CardTitle>
          <div className="bg-gray-50 p-1.5 rounded-full">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <CardDescription>{description}</CardDescription>
          {trend !== 0 && (
            <span className={`text-xs font-medium ${trendColor}`}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 