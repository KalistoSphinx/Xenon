"use client";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import {  useQuery } from "@tanstack/react-query";
import { AddIcon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router";
import { useCreateNote } from "@/Repos/notesRepo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await api.get("/workspaces");
      return res.data;
    },
  });

  const createNote = useCreateNote()

  const handleCreate = async () => {
    const noteId = crypto.randomUUID();

    createNote.mutate(noteId);

    navigate(`/dashboard/note/${noteId}`);
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mb-2">
            <SidebarMenuButton size="sm" render={<a href="#" />}>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate tracking-[0.35em] font-bold uppercase">
                  Xenon
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2">
          <Button className="w-full gap-2" onClick={handleCreate}>
            <HugeiconsIcon icon={AddIcon} className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavWorkspaces workspaces={workspaces} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session!.user.name,
            email: session!.user.email,
            avatar: session!.user.image,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
