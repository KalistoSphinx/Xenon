import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { Ellipsis } from "@hugeicons/core-free-icons";
import { StarIcon, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useUpdateNote } from "@/Repos/notesRepo";
import { useNavigate } from "react-router";
import type { Note, Workspace } from "@/lib/models";

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

function getTimeAgo(createdAt: Date) {
  const diffMs = Date.now() - createdAt.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;

  return `${days}d ago`;
}

export function NoteCard({
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

  const handleUpdate = (id: string, value: boolean) => {
    updateNote.mutate({
      id: id,
      value: {
        isStarred: value,
      },
    });
  };

  const preview = getPreview(note.content);
  const noteCreation = getTimeAgo(new Date(note.createdAt))

  return (
    <Card
      size="sm"
      className="group animate-drop-in transition-all duration-200 ease-in-out hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => navigate(`/dashboard/note/${note.id}`)}
    >
      <CardContent className="flex justify-between -mb-2">
        <div
          className="flex items-center gap-1.5"
          style={{
            color: workspace?.color || "var(--muted-foreground)",
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{
              backgroundColor: workspace?.color || "var(--muted-foreground)",
            }}
          />
          <p className="text-xs">{workspace?.name || "No workspace"}</p>
        </div>
        <CardAction
          className={`flex items-center gap-2 text-muted-foreground transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
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
              onClick={(e) => e.stopPropagation()}
              render={
                <span className="p-1 aria-expanded:bg-muted rounded-sm cursor-pointer" />
              }
            >
              <HugeiconsIcon size={18} icon={Ellipsis} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Pencil size={14} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-sm">{note.title || "Untitled"}</CardTitle>
        <CardDescription className="text-xs">
          {preview || "No content"}
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <Separator />
      <CardFooter>
        <CardDescription className="text-[11px]">{noteCreation}</CardDescription>
      </CardFooter>
    </Card>
  );
}
