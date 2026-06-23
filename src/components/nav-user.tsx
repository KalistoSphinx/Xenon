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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogoutIcon,
  UserCircle02Icon,
  LockPasswordIcon,
} from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  EllipsisVertical,
  Eye,
  EyeOff,
  AlertCircleIcon,
} from "lucide-react";

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
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  function handleOpenChangePassword() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setChangePasswordOpen(true);
  }

  async function handleChangePassword() {
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordError("");
    setIsChangingPassword(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      if (error) {
        setPasswordError(error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully", {
          position: "bottom-center",
        });
        setChangePasswordOpen(false);
      }
    } catch {
      setPasswordError("Something went wrong");
    } finally {
      setIsChangingPassword(false);
    }
  }

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
      <SidebarMenu className="">
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
                <span className="truncate text-xs text-sidebar-foreground/70">{user.email}</span>
              </div>
              <EllipsisVertical className="text-sidebar-foreground/70"></EllipsisVertical>
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
                      <span className="truncate font-medium text-white">{user.name}</span>
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

            <div className="relative flex items-center my-1">
              <div className="flex-1 border-t border-border" />
              <span className="px-3 text-xs text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleOpenChangePassword}
            >
              <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} className="mr-2 size-4" />
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="pt-0">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            {passwordError && (
              <div className="flex items-center gap-2 p-3 text-[13px] font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircleIcon size={16} />
                {passwordError}
              </div>
            )}

            <Field className="flex flex-col gap-4 mb-8">
              <Label htmlFor="current-password">Current Password</Label>
              <InputGroup className="h-10">
                <InputGroupInput
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="px-4 py-2.5"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field className="flex flex-col gap-4">
              <Label htmlFor="new-password">New Password</Label>
              <InputGroup className="h-10">
                <InputGroupInput
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="px-4 py-2.5"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field className="flex flex-col gap-4">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <InputGroup className="h-10">
                <InputGroupInput
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="px-4 py-2.5"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {confirmPassword && newPassword !== confirmPassword && (
                <FieldError>Passwords do not match</FieldError>
              )}
            </Field>

            <Button
              className="w-full"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Changing…" : "Change Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

