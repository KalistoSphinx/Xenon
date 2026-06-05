"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalCircle01Icon,
  FolderIcon,
  Share03Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Field, FieldError } from "./ui/field";
import { api } from "@/lib/api";

export function NavWorkspaces({
  workspaces,
}: {
  workspaces: {
    name: string;
    url: string;
    color: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceColor, setWorkspaceColor] = useState("");
  const [nameError, setNameError] = useState("");
  const [open, setOpen] = useState(false)

  const handleCreate = async () => {
    const name = workspaceName.trim();

    if(!name){
      setNameError("Name is required");
      return
    }

    setNameError("");

    try {
      await api.post("/workspaces", {
        name: name,
        color: workspaceColor
      })

      setOpen(false)
      console.log("Hello");
      

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SidebarGroup className="group">
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupAction className="opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Plus
                strokeWidth={2}
                size={15}
                className="text-sidebar-foreground/70 outline-none"
              />
            }
          />
          <PopoverContent align="start" className={"border border-border pt-0"}>
            <PopoverHeader>
              <PopoverTitle>Create Workspace</PopoverTitle>
              <PopoverDescription>
                Add a new workspace to organize your projects.
              </PopoverDescription>
            </PopoverHeader>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-start">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border overflow-hidden">
                  <Input
                    type="color"
                    className="absolute -left-2 -top-2 h-12 w-12 cursor-pointer border-0 p-0"
                    defaultValue="#3b82f6"
                    onChange={(e) => setWorkspaceColor(e.target.value)}
                  />
                </div>
                <Field data-invalid={!!nameError} className="flex flex-col flex-1 gap-1.5">
                  <Input
                  type="text"
                  placeholder="Workspace name"
                  aria-invalid={!!nameError}
                  className="h-8"
                  onChange={(e) => {
                    setWorkspaceName(e.target.value)
                    if(nameError) setNameError("");
                  }}
                />
                {nameError && (<FieldError>{nameError}</FieldError>)}
                </Field>
              </div>
              <Button size="sm" className="w-full" onClick={handleCreate}>
                Create
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarGroupAction>
      <SidebarMenu>
        {workspaces.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton render={<a href={item.url} />}>
              <span
                className={`size-1.5 rounded-full `}
                style={{
                  backgroundColor: item.color,
                }}
              />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                  />
                }
              >
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  strokeWidth={2}
                />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={FolderIcon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Share03Icon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
