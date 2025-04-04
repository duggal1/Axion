import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AgentMetrics } from "@/components/agent/agent-metrics"
import { AgentCards } from "@/components/agent/agent-cards"
import { RecentCalls } from "@/components/agent/recent-calls"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1 mt-8">
          <div className="@container/main flex flex-col flex-1 gap-4">
            <div className="px-6">
              <h1 className="font-serif font-medium text-gray-900 text-3xl">AI Voice Agents</h1>
              <p className="mt-1 text-gray-500">Manage your intelligent voice assistants and monitor performance</p>
            </div>
            <div className="flex flex-col gap-6 px-6 py-4">
              <AgentMetrics />
              <AgentCards />
              <RecentCalls />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
