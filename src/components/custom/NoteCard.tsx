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

interface Note {
  title: string;
  content: any;
  id: string;
  isStarred: boolean;
  isTrashed: boolean;
  createdAt: EpochTimeStamp;
}

interface Workspace {
  name: string;
  color: string;
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

  return (
    <Card
      size="sm"
      className="group animate-drop-in transition-all duration-200 ease-in-out hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="flex justify-between -mb-2">
        <div className="flex items-center gap-1.5 text-amber-600">
          <span className="size-1.5 rounded-full bg-amber-600" />
          <p className="text-xs">{note.id}</p>
        </div>
        <CardAction
          className={`flex items-center gap-2 text-muted-foreground transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <StarIcon
            size={14}
            strokeWidth={2}
            onClick={() => {
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
            >
              <HugeiconsIcon size={18} icon={Ellipsis} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem>
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
          Reading list - distributed systems
        </CardTitle>
        <CardDescription className="text-xs">
          Papers to read: Dynamo (Amazon), Raft Consensus, Spanner, Bigtable,
          MapReduce, Chord DHT.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <Separator />
      <CardFooter>
        <CardDescription className="text-[11px]">2m ago</CardDescription>
      </CardFooter>
    </Card>
  );
}
