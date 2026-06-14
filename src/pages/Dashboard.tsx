import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useLocation } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LeftToRightListBulletIcon,
  WindowsNewIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function HomePage() {
  const location = useLocation();
  const path = location.pathname;
  const isEditorRoute = path.startsWith("/dashboard/note/");
  const isWorkspaceRoute = path.startsWith("/dashboard/workspace/");
  const segments = path.split("/");
  const lastSegment = segments.pop() ?? "";
  const queryClient = useQueryClient();
  
  const workspaceName = isWorkspaceRoute
    ? (queryClient.getQueryData<{ id: string; name: string; color: string }[]>(["workspaces"])?.find(
        (w) => w.id === lastSegment,
      )?.name ?? "Workspace")
    : null;

  const title = workspaceName ?? (lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));

  const [viewType, setViewType] = useState("cards");
  const [inputValue, setInputValue] = useState("");
  const searchQuery = useDebounce(inputValue, 300);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {!isEditorRoute && (
          <>
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
                      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-3">
                  <InputGroup className="h-8 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                    <InputGroupInput
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Search..."
                    />
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
              <div className="pr-4">
                <Tabs
                  defaultValue="cards"
                  value={viewType}
                  onValueChange={(val) => setViewType(val)}
                >
                  <TabsList className="rounded-2xl">
                    <TabsTrigger value="cards">
                      <HugeiconsIcon icon={WindowsNewIcon} />
                      {/* <span className="text-xs">Cards</span> */}
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <HugeiconsIcon icon={LeftToRightListBulletIcon} />
                      {/* <span className="text-xs">List</span> */}
                    </TabsTrigger>
                    <TabsContent value="cards"></TabsContent>
                    <TabsContent value="list"></TabsContent>
                  </TabsList>
                </Tabs>
              </div>
            </header>
            <Separator />
          </>
        )}
        <Outlet context={{viewType, searchQuery}} />
      </SidebarInset>
    </SidebarProvider>
  );
}
