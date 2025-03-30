"use client"

import * as React from "react"
import {
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import Image from 'next/image'
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Agent Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Call Workflows",
      url: "/workflows",
      icon: ListIcon,
    },
    {
      title: "Sales Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Team Management",
      url: "/team",
      icon: UsersIcon,
    },
    {
      title: "Voice Campaigns",
      url: "/campaigns",
      icon: FolderIcon,
    },
  ],
  navClouds: [
    {
      title: "Voice Recordings",
      icon: CameraIcon,
      isActive: true,
      url: "/recordings",
      items: [
        {
          title: "Active Calls",
          url: "/recordings/active",
        },
        {
          title: "Archived Calls",
          url: "/recordings/archived",
        },
      ],
    },
    {
      title: "AI Scripts",
      icon: FileTextIcon,
      url: "/scripts",
      items: [
        {
          title: "Active Scripts",
          url: "/scripts/active",
        },
        {
          title: "Archived Scripts",
          url: "/scripts/archived",
        },
      ],
    },
    {
      title: "Custom Prompts",
      icon: FileCodeIcon,
      url: "/prompts",
      items: [
        {
          title: "Active Prompts",
          url: "/prompts/active",
        },
        {
          title: "Archived Prompts",
          url: "/prompts/archived",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Agent Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Support Hub",
      url: "/support",
      icon: HelpCircleIcon,
    },
    {
      title: "Search Calls",
      url: "/search",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Knowledge Base",
      url: "/knowledge",
      icon: DatabaseIcon,
    },
    {
      name: "Performance Reports",
      url: "/reports",
      icon: ClipboardListIcon,
    },
    {
      name: "Script Builder",
      url: "/builder",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="bg-white  border-r border-gray-200  shadow-none font-serif"
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
      
      <SidebarHeader className="py-6 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-0"
            >
              <a href="#" className="flex items-center">
                <Image
                  src="/icons/axion-logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                  className="mr-3"
                />
                <span className="text-xl font-bold font-serif tracking-wide text-gray-900">Axion</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-2 sidebar-content">
        <div className="space-y-10">
          <div>
            <NavMain items={data.navMain} />
          </div>
          
          <div>
            <h3 className="mb-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Resources</h3>
            <NavDocuments items={data.documents} />
          </div>
          
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-50 py-4 px-4 mt-4">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}