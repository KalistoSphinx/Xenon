import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Outlet, useLocation } from "react-router"
import {HugeiconsIcon} from "@hugeicons/react"
import {LeftToRightListBulletIcon, WindowsNewIcon} from "@hugeicons/core-free-icons"

export default function Page() {
  
  const location = useLocation()
  const path = location.pathname
  const name = path.split("/").pop()
  const title = name?.charAt(0).toUpperCase() + name!.slice(1)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 -my-1">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>  
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="pr-4">
            <Tabs defaultValue="cards" >
              <TabsList className="rounded-2xl">
                <TabsTrigger value="cards">
                  <HugeiconsIcon icon={WindowsNewIcon} /> 
                  {/* <span className="text-xs">Cards</span> */}
                </TabsTrigger>
                <TabsTrigger value="list">
                  <HugeiconsIcon icon={LeftToRightListBulletIcon} /> 
                  {/* <span className="text-xs">List</span> */}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>
        <Separator />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
