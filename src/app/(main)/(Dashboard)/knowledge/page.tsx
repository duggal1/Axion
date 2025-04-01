import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DocumentUploader } from "@/components/knowledge/document-uploader"
import { DocumentList } from "@/components/knowledge/document-list"
import { CreateKnowledgeBaseButton } from "@/components/knowledge/create-knowledge-base-button"

export default function KnowledgePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col flex-1 mt-8">
          <div className="@container/main flex flex-col flex-1 gap-4">
            <div className="flex justify-between items-center px-6">
              <div>
                <h1 className="font-serif font-medium text-gray-900 text-3xl">Knowledge Base</h1>
                <p className="mt-1 text-gray-500">Upload documents to train and inform your AI voice agents</p>
              </div>
              <CreateKnowledgeBaseButton />
            </div>
            <div className="flex flex-col gap-6 px-6 py-4">
              <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <DocumentUploader />
                </div>
                <div className="lg:col-span-2">
                  <DocumentList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 