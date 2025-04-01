import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CreateToolButton } from "@/components/tools/create-tool-button"
import { ToolList } from "@/components/tools/tool-list"

export default function ToolsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1 mt-8">
          <div className="@container/main flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center px-6">
              <div>
                <h1 className="font-serif font-medium text-gray-900 text-3xl">Agent Tools</h1>
                <p className="mt-1 text-gray-500">Configure tools and integrations for your AI voice agents</p>
              </div>
              <CreateToolButton />
            </div>
            <div className="flex flex-col gap-6 px-6 py-4">
              <ToolList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 