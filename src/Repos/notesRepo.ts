import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateNote = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post("/note", {
        id: id,
      });
      return res.data;
    },
    onSuccess: (newNote, _variables, _onMutateResult, context) => {
      console.log(newNote)
      context.client.setQueryData(["notes"], (old: any) => [
        ...(old || []),
        { notes: newNote, workspaces: {} },
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

export const useUpdateNote = () =>
  useMutation({
    mutationFn: async ({ id, value }: { id: string; value: any }) => {
      await api.patch(`/note/${id}`, value);
    },
    onMutate: async ({ id: noteId, value: value }, context) => {
      await context.client.cancelQueries({ queryKey: ["notes"] });

      const previousNotes = context.client.getQueryData(["notes"]);

      context.client.setQueryData(["notes"], (old: any) =>
        old.map((item: any) =>
          item.notes.id == noteId
            ? { ...item, notes: { ...item.notes, ...value } }
            : item,
        ),
      );

      return { previousNotes };
    },
    onError: (error, _, onMutateResult, context) => {
      context.client.setQueryData(
        ["notes"],
        onMutateResult?.previousNotes,
      );
      console.log(error);
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["notes"] });
    },
  });
