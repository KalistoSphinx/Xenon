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
    onMutate: async (id, context) => {
      // Seed the individual note cache so EditorPage renders instantly
      // without showing a loading skeleton.
      const placeholderNote = {
        id,
        title: "",
        content: null,
        createdAt: new Date().toISOString(),
      };
      context.client.setQueryData(["notes", id], {
        notes: placeholderNote,
        workspaces: {},
      });
    },
    onSuccess: (newNote, _variables, _onMutateResult, context) => {
      context.client.setQueryData(["notes"], (old: any) => [
        ...(old || []),
        { notes: newNote, workspaces: {} },
      ]);
      // Update the individual note cache with the real server response
      context.client.setQueryData(["notes", newNote.id], {
        notes: newNote,
        workspaces: {},
      });
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
      await context.client.cancelQueries({ queryKey: ["notes", noteId] });

      const previousNotes = context.client.getQueryData(["notes"]);
      const previousNote = context.client.getQueryData(["notes", noteId]);

      context.client.setQueryData(["notes"], (old: any) =>
        old.map((item: any) =>
          item.notes.id == noteId
            ? { ...item, notes: { ...item.notes, ...value } }
            : item,
        ),
      );

      context.client.setQueryData(["notes", noteId], (old: any) => {
        if (!old) return old;
        if (old.notes) {
          return { ...old, notes: { ...old.notes, ...value } };
        }
        return { ...old, ...value };
      });

      return { previousNotes, previousNote  };
    },
    onError: (error, variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["notes"],
        onMutateResult?.previousNotes,
      );
      context.client.setQueryData(
        ["notes", variables.id],
        onMutateResult?.previousNote,
      );
      console.log(error);
    },
    onSettled: (_data, _error, variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["notes"] });
      context.client.invalidateQueries({ queryKey: ["notes", variables.id] });
    },
  });
