"use client"

import * as React from "react"
import {
  BarChartIcon,
  BotIcon,
  DatabaseIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  PhoneIcon,
  SettingsIcon,
  UsersIcon,
  WrenchIcon,
  MessageSquareIcon
} from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  // Define navigation items
  const mainNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      isActive: pathname === "/dashboard"
    },
    {
      title: "AI Agents",
      url: "/agents",
      icon: BotIcon,
      isActive: pathname.startsWith("/agents") || pathname === "/create-agent"
    },
    {
      title: "Calls History",
      url: "/calls",
      icon: PhoneIcon,
      isActive: pathname.startsWith("/calls")
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: ListIcon,
      isActive: pathname.startsWith("/workflows")
    },
    {
      title: "Prompt Library",
      url: "/prompts",
      icon: MessageSquareIcon,
      isActive: pathname.startsWith("/prompts")
    }
  ]
  
  const resourceNavItems = [
    {
      name: "Knowledge Base",
      url: "/knowledge",
      icon: DatabaseIcon,
      isActive: pathname.startsWith("/knowledge")
    },
    {
      name: "Tools",
      url: "/tools",
      icon: WrenchIcon,
      isActive: pathname.startsWith("/tools")
    },
    {
      name: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
      isActive: pathname.startsWith("/analytics")
    },
    {
      name: "Team",
      url: "/team",
      icon: UsersIcon,
      isActive: pathname.startsWith("/team")
    }
  ]
  
  const secondaryNavItems = [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
      isActive: pathname.startsWith("/settings")
    },
    {
      title: "Support",
      url: "/support",
      icon: HelpCircleIcon,
      isActive: pathname.startsWith("/support")
    }
  ]
  
  const user = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/user-01.jpg"
  }

  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="bg-white shadow-none border-gray-200 border-r font-serif"
      {...props}
    >
      <style jsx global>{`
        /* Remove scrollbar */
        .sidebar-content::-webkit-scrollbar {
          display: none;
        }
        .sidebar-content {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Custom styling for navigation items */
        [data-slot="sidebar-menu-item"] a {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          margin-bottom: 2px;
          color: #6b7280;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        [data-slot="sidebar-menu-item"] a:hover {
          background-color: rgba(243, 244, 246, 0.7);
          color: #111827;
        }
        
        [data-slot="sidebar-menu-item"] a svg {
          width: 18px;
          height: 18px;
          margin-right: 12px;
          opacity: 0.7;
        }
        
        [data-slot="sidebar-menu-item"][data-active="true"] a {
          background-color: rgba(243, 244, 246, 0.9);
          color: #111827;
        }
      `}</style>
      
      <SidebarHeader className="px-4 py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-0"
            >
              <a href="/dashboard" className="flex items-center">
                <Image
                  src="/icons/axion-logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                  className="mr-3"
                />
                <span className="font-serif font-bold text-gray-900 text-xl tracking-wide">Axion</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-2 sidebar-content">
        <div className="space-y-10">
          <div>
            <NavMain items={mainNavItems} />
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Resources</h3>
            <NavDocuments items={resourceNavItems} />
          </div>
          
          <NavSecondary items={secondaryNavItems} className="mt-auto" />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="mt-4 px-4 py-4 border-gray-50 border-t">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}