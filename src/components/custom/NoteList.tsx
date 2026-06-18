import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "../ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Ellipsis } from "@hugeicons/core-free-icons";
import { StarIcon, Trash2, Copy, Undo, Trash2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useCreateNote, useDeleteNote, useUpdateNote } from "@/Repos/notesRepo";
import type { Note, Workspace } from "@/lib/models";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";

function extractTextFromTiptap(node: any): string {
  if (!node) return "";

  if (node.type === "text") {
    return node.text || "";
  }

  if (node.content && Array.isArray(node.content)) {
    const childText = node.content.map(extractTextFromTiptap).join("");

    const blockNodes = new Set([
      "paragraph",
      "heading",
      "blockquote",
      "bulletList",
      "orderedList",
      "listItem",
      "codeBlock",
      "horizontalRule",
    ]);

    if (blockNodes.has(node.type)) {
      return childText + "\n";
    }

    return childText;
  }

  return "";
}

function getPreview(tiptapJson: any, maxLength = 150): string {
  const fullText = extractTextFromTiptap(tiptapJson).trim();
  if (fullText.length <= maxLength) return fullText;
  return fullText.slice(0, maxLength).trimEnd() + "…";
}

export function NoteList({
  note,
  workspace,
  index = 0,
}: {
  note: Note;
  workspace: Workspace;
  index?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const createNote = useCreateNote();
  const queryClient = useQueryClient();
  const [deletedNote, setDeletedNote] = useState<Note | null>(null);

  const handleDuplicate = () => {
    const newId = crypto.randomUUID();
    createNote.mutate(newId, {
      onSuccess: () => {
        updateNote.mutate({
          id: newId,
          value: {
            title: note.title ? `${note.title} (Copy)` : "Untitled (Copy)",
            content: note.content,
            workspaceId: workspace?.id || null,
            isStarred: note.isStarred,
          },
        });

        if (workspace?.id) {
          queryClient.setQueryData(["notes", newId], (old: any) => {
            if (!old) return old;
            return { ...old, workspaces: workspace };
          });
          queryClient.setQueryData(["notes"], (old: any) => {
            if (!Array.isArray(old)) return old;
            return old.map((item: any) =>
              item.notes?.id === newId
                ? { ...item, workspaces: workspace }
                : item,
            );
          });
        }
        setIsOpen(false);
      },
      onError: () => {
        toast.error("Failed to duplicate note", { position: "bottom-center" });
      },
    });
  };

  const handleUpdate = (id: string, value: boolean) => {
    updateNote.mutate({
      id: id,
      value: {
        isStarred: value,
      },
    });
  };

  const handleRestore = (id: string) => {
    updateNote.mutate({
      id: id,
      value: {
        trashedAt: null,
      },
    });
  };

  const handleDelete = (id: string) => {
    updateNote.mutate({
      id: id,
      value: {
        trashedAt: new Date().toISOString(),
      },
    });

    toast("Note Moved to trash", {
      style: {
        width: 250,
        borderRadius: 30,
        paddingInline: 25,
      },
      position: "bottom-center",
      action: {
        label: "Restore",
        onClick: () => handleRestore(note.id),
      },
      actionButtonStyle: {
        background: "none",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        color: "white",
      },
    });
  };

  const preview = getPreview(note.content);

  return (
    <>
      <Card
        size="sm"
        className="group animate-drop-in data-[size=sm]:py-1.5"
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={() => navigate(`/dashboard/note/${note.id}`)}
      >
        <CardContent className="flex justify-between gap-2">
          <div className="flex items-center min-w-0 flex-1">
            <span
              className="size-1.5 min-w-1.5 min-h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: workspace?.color || "var(--muted-foreground)",
              }}
            />
            <CardTitle className="text-sm ml-3 shrink-0">
              {note.title || "Untitled"}
            </CardTitle>
            <div className="ml-2 flex-1 max-w-140 overflow-hidden">
              <CardDescription className="text-xs truncate">
                {preview || "No content"}
              </CardDescription>
            </div>
          </div>

          <CardAction
            className={`flex items-center gap-2 text-muted-foreground shrink-0 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <StarIcon
              size={14}
              strokeWidth={2}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate(note.id, !note.isStarred);
              }}
              fill={note.isStarred ? "#fbbf24" : "none"}
              stroke={note.isStarred ? "#fbbf24" : "currentColor"}
              className={
                "cursor-pointer transition-all duration-200 hover:scale-120"
              }
            />
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger
                render={
                  <span className="p-1 aria-expanded:bg-muted rounded-sm cursor-pointer" />
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <HugeiconsIcon size={18} icon={Ellipsis} strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                {note.trashedAt ? (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(note.id);
                    }}
                  >
                    <Undo size={14} />
                    Restore
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate();
                    }}
                  >
                    <Copy size={14} />
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (note.trashedAt) {
                      return setDeletedNote(note);
                    }

                    handleDelete(note.id);
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deletedNote}
        onOpenChange={(open) => {
          if (!open) setDeletedNote(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the note and you will not be able to
              recover it. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteNote.isPending}
              onClick={() => {
                deleteNote.mutate(deletedNote!.id);
                setDeletedNote(null);
              }}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
