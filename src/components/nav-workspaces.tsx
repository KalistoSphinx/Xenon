"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
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
  Delete02Icon,
  Edit03Icon,
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
import EditWorkspace from "./edit-workspace";
import { useCreateWorkspace, useDeleteWorkspace } from "@/Repos/workspaceRepo";
import { useLocation, useNavigate } from "react-router";

interface Workspace {
  id: string;
  name: string;
  color: string;
}

export function NavWorkspaces({ workspaces }: { workspaces: Workspace[] }) {
  const { isMobile } = useSidebar();

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceColor, setWorkspaceColor] = useState("#3b82f6");
  const [nameError, setNameError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );
  const createWorkspace = useCreateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const workspace_id = path.split("/").pop() ?? "";

  const handleCreate = async () => {
    const name = workspaceName.trim();

    if (!name) {
      setNameError("Name is required");
      return;
    }

    setNameError("");

    await createWorkspace.mutateAsync({ workspaceName, workspaceColor });

    setWorkspaceName("");
    setWorkspaceColor("#3b82f6");
    setOpen(false);
  };

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
          <PopoverContent align="start" className="border border-border pt-0">
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
                    value={workspaceColor}
                    onChange={(e) => setWorkspaceColor(e.target.value)}
                  />
                </div>
                <Field
                  data-invalid={!!nameError}
                  className="flex flex-col flex-1 gap-1.5"
                >
                  <Input
                    type="text"
                    placeholder="Workspace name"
                    value={workspaceName}
                    aria-invalid={!!nameError}
                    className="h-8"
                    onChange={(e) => {
                      setWorkspaceName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                  />
                  {nameError && <FieldError>{nameError}</FieldError>}
                </Field>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={handleCreate}
                disabled={createWorkspace.isPending}
              >
                {createWorkspace.isPending ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarGroupAction>

      <SidebarMenu>
        {workspaces.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              isActive={item.id == workspace_id}
              onClick={() => navigate(`/dashboard/workspace/${item.id}`)}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted group-focus-within/menu-item:opacity-0 transition-opacity duration-200 ease-in-out"
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
                className="min-w-32"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => setEditingWorkspace(item)}>
                  <HugeiconsIcon
                    icon={Edit03Icon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={deleteWorkspace.isPending}
                  onClick={() => deleteWorkspace.mutate(item.id)}
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    strokeWidth={2}
                    className="text-muted-foreground"
                  />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <Dialog
        open={!!editingWorkspace}
        onOpenChange={(open) => {
          if (!open) setEditingWorkspace(null);
        }}
      >
        {editingWorkspace && (
          <EditWorkspace
            key={editingWorkspace.id}
            item={editingWorkspace}
            onClose={() => setEditingWorkspace(null)}
          />
        )}
      </Dialog>
    </SidebarGroup>
  );
}
