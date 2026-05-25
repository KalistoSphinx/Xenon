import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Note02Icon, StarIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { useSearchParams } from "react-router";

export function NavMain() {

  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page");

  return (
    <SidebarGroup>
      <SidebarMenu>
        
        <SidebarMenuItem key={"notes"}>
          <SidebarMenuButton isActive={page == "notes"} onClick={() => setSearchParams({page: "notes"})}>
            <HugeiconsIcon icon={Note02Icon} strokeWidth={2}/> <span>Notes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"starred"}>
          <SidebarMenuButton isActive={page == "starred"} onClick={() => setSearchParams({page: "starred"})}>
            <HugeiconsIcon icon={StarIcon} strokeWidth={2}/> <span>Starred</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"trash"}>
          <SidebarMenuButton isActive={page == "trash"} onClick={() => setSearchParams({page: "trash"})}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2}/> <span>Trash</span>
          </SidebarMenuButton>
        </SidebarMenuItem>


      </SidebarMenu>
    </SidebarGroup>
  )
}
