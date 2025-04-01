import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { PromptList } from "@/components/prompts/prompt-list"
import { CreatePromptButton } from "@/components/prompts/create-prompt-button"


export default function PromptsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1 mt-8">
          <div className="@container/main flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center px-6">
              <div>
                <h1 className="font-serif font-medium text-gray-900 text-3xl">Prompt Library</h1>
                <p className="mt-1 text-gray-500">Create and manage reusable prompts for your AI voice agents</p>
              </div>
              <CreatePromptButton />
            </div>
            <div className="flex flex-col gap-6 px-6 py-4">
              <PromptList />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 