import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Note02Icon, StarIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { Link, useLocation } from "react-router"

export function NavMain() {

  const location = useLocation()
  const path = location.pathname  

  return (
    <SidebarGroup>
      <SidebarMenu>
        
        <SidebarMenuItem key={"notes"}>
          <SidebarMenuButton isActive={path == "/dashboard/notes" || path == "/dashboard"} render={<Link to="notes" />}>
            <HugeiconsIcon icon={Note02Icon} strokeWidth={2}/> <span>Notes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"starred"}>
          <SidebarMenuButton isActive={path == "/dashboard/starred" } render={<Link to="starred" />}>
            <HugeiconsIcon icon={StarIcon} strokeWidth={2}/> <span>Starred</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"trash"}>
          <SidebarMenuButton isActive={path == "/dashboard/trash"} render={<Link to="trash" />}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2}/> <span>Trash</span>
          </SidebarMenuButton>
        </SidebarMenuItem>


      </SidebarMenu>
    </SidebarGroup>
  )
}
