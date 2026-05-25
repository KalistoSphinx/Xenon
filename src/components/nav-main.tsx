import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Note02Icon, StarIcon, Delete02Icon } from "@hugeicons/core-free-icons"
import { useState } from "react";

export function NavMain() {

  const [filter, setFilter] = useState("");

  return (
    <SidebarGroup>
      <SidebarMenu>
        
        <SidebarMenuItem key={"notes"}>
          <SidebarMenuButton isActive={filter == "notes"} onClick={() => setFilter("notes")}>
            <HugeiconsIcon icon={Note02Icon} strokeWidth={2}/> <span>Notes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"starred"}>
          <SidebarMenuButton isActive={filter == "starred"} onClick={() => setFilter("starred")}>
            <HugeiconsIcon icon={StarIcon} strokeWidth={2}/> <span>Starred</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem key={"trash"}>
          <SidebarMenuButton isActive={filter == "trash"} onClick={() => setFilter("trash")}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2}/> <span>Trash</span>
          </SidebarMenuButton>
        </SidebarMenuItem>


      </SidebarMenu>
    </SidebarGroup>
  )
}
