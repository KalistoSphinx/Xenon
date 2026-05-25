import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Note02Icon, StarIcon, Delete02Icon } from "@hugeicons/core-free-icons"

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        
        <SidebarMenuItem>
          <SidebarMenuButton isActive={true}>
            <HugeiconsIcon icon={Note02Icon} strokeWidth={2}/> <span>Notes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton>
            <HugeiconsIcon icon={StarIcon} strokeWidth={2}/> <span>Starred</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2}/> <span>Trash</span>
          </SidebarMenuButton>
        </SidebarMenuItem>


      </SidebarMenu>
    </SidebarGroup>
  )
}
