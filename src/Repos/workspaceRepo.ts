import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async ({
      workspaceName,
      workspaceColor,
    }: {
      workspaceName: string;
      workspaceColor: string;
    }) => {
      const res = await api.post("/workspaces", {
        name: workspaceName,
        color: workspaceColor,
      });
      return res.data;
    },
    onSuccess: (newWorkspace, _variables, _onMutateResult, context) => {
      context.client.setQueryData(["workspaces"], (old: any) => [
        ...(old || []),
        newWorkspace,
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteWorkspace = () => {
    return useMutation({
  mutationFn: async (id: string) => {
    await api.delete(`/workspaces/${id}`);
  },
  onMutate: async (deleteId, context) => {
    await context.client.cancelQueries({ queryKey: ["workspaces"] });

    const previousWorkspaces = context.client.getQueryData(["workspaces"]);

    context.client.setQueryData(["workspaces"], (old: any) =>
      old.filter((workspace: any) => workspace.id != deleteId),
    );

    return { previousWorkspaces };
  },
  onError: (error, _, onMutateResult, context) => {
    context.client.setQueryData(
      ["workspaces"],
      onMutateResult?.previousWorkspaces,
    );
    console.log(error);
  },
  onSettled: (_data, _error, _variables, _onMutateResult, context) => {
    context.client.invalidateQueries({ queryKey: ["workspaces"] });
  },
});
}

export const useUpdateWorkspace = (onClose: () => void) => useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<any>;
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
