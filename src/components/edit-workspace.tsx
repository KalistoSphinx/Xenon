import { useState } from "react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface workspace {
  id: string
  name: string;
  color: string;
}

export default function EditWorkspace({item, onClose} : {
  item: workspace,
  onClose: () => void
}) {
  const [newWorkspaceName, setWorkspaceName] = useState(item.name);
  const [newWorkspaceColor, setWorkspaceColor] = useState(item.color);
  const [nameError, setNameError] = useState("");
  const queryClient = useQueryClient();

  const updateWorkspace = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/workspaces/${id}`, {
        name: newWorkspaceName,
        color: newWorkspaceColor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onClose()
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpdate = (id: string) => {
    const name = newWorkspaceName.trim();

    if (!name) {
      setNameError("Name is required");
      return;
    }

    setNameError("");
    updateWorkspace.mutate(id);
  };

  return (
    <DialogContent className={"pt-0"}>
      <DialogHeader className="flex flex-col gap-1">
        <DialogTitle>Edit Workspace</DialogTitle>
        <DialogDescription>Change your workspace details</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-start">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border overflow-hidden">
            <Input
              type="color"
              className="absolute -left-2 -top-2 h-12 w-12 cursor-pointer border-0 p-0"
              value={newWorkspaceColor}
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
              value={newWorkspaceName}
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
                onClick={() => handleUpdate(item.id)}
                disabled={updateWorkspace.isPending}
              >
                {updateWorkspace.isPending ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
      </div>
    </DialogContent>
  );
}
