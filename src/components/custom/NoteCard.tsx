import { useState, useEffect } from "react";
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
import type { Note, Workspace } from "@/lib/models";
import { useNavigate } from "react-router";

function stripHtml(html: any): string {
  if (!html) return "";
  if (typeof html === "string") return html.replace(/<[^>]*>/g, "").trim();
  return "";
}

function getRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [starred, setStarred] = useState(note.isStarred);

  const updateNote = useUpdateNote();

  useEffect(() => {
    setStarred(note.isStarred);
  }, [note.isStarred]);

  const handleUpdate = (id: string, value: boolean) => {
    setStarred(value);
    updateNote.mutate({
      id: id,
      value: {
        isStarred: value,
      },
    });
  };

  const contentPreview = stripHtml(note.content).substring(0, 120);

  return (
    <Card
      size="sm"
      className="group animate-drop-in transition-all duration-200 ease-in-out hover:-translate-y-0.5 cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => navigate(`/dashboard/note/${note.id}`)}
    >
      <CardContent className="flex justify-between -mb-2">
        <div className="flex items-center gap-1.5" style={{
          color: workspace?.color || "currentColor"
        }}>
          <span className="size-1.5 rounded-full" style={{
            backgroundColor: workspace?.color || "currentColor"
          }} />
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
              handleUpdate(note.id, !starred);
            }}
            fill={starred ? "#fbbf24" : "none"}
            stroke={starred ? "#fbbf24" : "currentColor"}
            className={"cursor-pointer transition-all duration-200 hover:scale-120"}
          />
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
              render={
                <span className="p-1 aria-expanded:bg-muted rounded-sm cursor-pointer" />
              }
              onClick={(e: any) => e.stopPropagation()}
            >
              <HugeiconsIcon size={18} icon={Ellipsis} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={(e: any) => { e.stopPropagation(); navigate(`/dashboard/note/${note.id}`); }}>
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
      <CardHeader>
        <CardTitle className="text-sm">
          {note.title || "Untitled"}
        </CardTitle>
          <CardDescription className="text-xs">
            {contentPreview || "No content"}
          </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <Separator />
      <CardFooter>
        <CardDescription className="text-[11px]">{getRelativeTime(note.createdAt)}</CardDescription>
      </CardFooter>
    </Card>
  );
}
