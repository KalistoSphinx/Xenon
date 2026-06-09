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
  id: string;
  name: string;
  color: string;
}

export default function EditWorkspace({
  item,
  onClose,
}: {
  item: workspace;
  onClose: () => void;
}) {
  const [newWorkspaceName, setWorkspaceName] = useState(item.name);
  const [newWorkspaceColor, setWorkspaceColor] = useState(item.color);
  const [nameError, setNameError] = useState("");

  const updateWorkspace = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<workspace>;
    }) => {
      await api.patch(`/workspaces/${id}`, data);
    },
    onMutate: async ({id: workspaceId, data: payload}, context) => {
      await context.client.cancelQueries({queryKey: ["workspaces"]})

      const previousWorkspaces = context.client.getQueryData(["workspaces"])

      context.client.setQueryData(["workspaces"], (old: any) =>
        old.map((workspace: any) => workspace.id == workspaceId ? {...workspace, ...payload} : workspace))

      onClose()

      return {previousWorkspaces}
    },
    onError: (error, _, onMutateResult, context) => {
      context.client.setQueryData(["workspaces"], onMutateResult?.previousWorkspaces)
      console.log(error);
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({queryKey: ["workspaces"]})
    }
  });

  const handleUpdate = (id: string) => {
    const name = newWorkspaceName.trim();

    if (!name) {
      setNameError("Name is required");
      return;
    }

    setNameError("");

    const payload: Partial<workspace> = {};

    if (name !== item.name) {
      payload.name = name;
    }

    if (newWorkspaceColor !== item.color) {
      payload.color = newWorkspaceColor;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    updateWorkspace.mutate({ id, data: payload });
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
          Save
        </Button>
      </div>
    </DialogContent>
  );
}
