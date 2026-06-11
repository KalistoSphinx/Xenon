import { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "../ui/card";
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
import type { Note, Workspace } from "@/lib/models";
import { useNavigate } from "react-router";

function stripHtml(html: any): string {
  if (!html) return "";
  if (typeof html === "string") return html.replace(/<[^>]*>/g, "").trim();
  return "";
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [starred, setStarred] = useState(note.isStarred);

  const updateNote = useUpdateNote();

  useEffect(() => {
    setStarred(note.isStarred);
  }, [note.isStarred]);

  const handleStarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newVal = !starred;
    setStarred(newVal);
    updateNote.mutate({ id: note.id, value: { isStarred: newVal } });
  };

  const contentPreview = stripHtml(note.content).substring(0, 120);

  return (
    <Card
      size="sm"
      className="group animate-drop-in cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => navigate(`/dashboard/note/${note.id}`)}
    >
      <CardContent className="flex items-center justify-between gap-2">
        <div className="flex items-center min-w-0 flex-1">
          <span className="size-1.5 min-w-1.5 min-h-1.5 rounded-full bg-amber-600 shrink-0" />
          <CardTitle className="text-sm ml-3 shrink-0">
            {note.title || "Untitled"}
          </CardTitle>
          <div className="ml-2 flex-1 max-w-140 overflow-hidden">
            <CardDescription className="text-xs truncate">
              {contentPreview || "No content"}
            </CardDescription>
          </div>
        </div>

        <CardAction
          className={`flex items-center gap-2 text-muted-foreground shrink-0 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <StarIcon
            size={14}
            strokeWidth={2}
            onClick={handleStarToggle}
            fill={starred ? "#fbbf24" : "none"}
            stroke={starred ? "#fbbf24" : "currentColor"}
            className="cursor-pointer transition-all duration-200 hover:scale-120"
          />
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
              render={
                <span className="p-1 aria-expanded:bg-muted rounded-sm cursor-pointer" />
              }
            >
              <HugeiconsIcon size={18} icon={Ellipsis} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => navigate(`/dashboard/note/${note.id}`)}>
                <Pencil size={14} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardContent>
    </Card>
  );
}
