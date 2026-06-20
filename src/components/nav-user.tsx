"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogoutIcon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { EllipsisVertical } from "lucide-react";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string | null | undefined;
  };
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [nameError, setNameError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function logOutUser() {
    await authClient.signOut();
  }

  function handleOpenAccount() {
    setNewName(user.name);
    setNameError("");
    setAccountOpen(true);
  }

  async function handleSaveName() {
    const trimmed = newName.trim();

    if (!trimmed) {
      setNameError("Name cannot be empty");
      return;
    }

    if (trimmed === user.name) {
      setAccountOpen(false);
      return;
    }

    setNameError("");
    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({ name: trimmed });

      if (error) {
        toast.error("Failed to update name", { position: "bottom-center" });
      } else {
        toast.success("Name updated successfully", {
          position: "bottom-center",
        });
        setAccountOpen(false);
      }
    } catch {
      toast.error("Something went wrong", { position: "bottom-center" });
    } finally {
      setIsSaving(false);
    }
  }

  const { isMobile } = useSidebar();
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="aria-expanded:bg-muted"
                />
              }
            >
              <Avatar>
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <EllipsisVertical></EllipsisVertical>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-2xl"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleOpenAccount}>
                  <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logOutUser}>
                <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className={"pt-0"}>
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription>
              View your account details and update your display name.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.avatar ?? undefined}
                  alt={user.name}
                />
                <AvatarFallback className="text-lg">
                  {user.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="grid text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="account-email">Email</Label>
              <Input
                id="account-email"
                type="email"
                value={user.email}
                disabled
                className="disabled:opacity-70"
              />
            </div>

            <Field
              data-invalid={!!nameError}
              className="flex flex-col gap-3"
            >
              <Label htmlFor="account-name">Name</Label>
              <Input
                id="account-name"
                type="text"
                placeholder="Your name"
                value={newName}
                aria-invalid={!!nameError}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (nameError) setNameError("");
                }}
              />
              {nameError && <FieldError>{nameError}</FieldError>}
            </Field>

            <Button
              className="w-full"
              onClick={handleSaveName}
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

