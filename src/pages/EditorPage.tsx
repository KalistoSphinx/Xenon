import Tiptap from "@/components/tiptap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { useUpdateNote } from "@/Repos/notesRepo";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Ellipsis, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const updateNote = useUpdateNote();

  const [title, setTitle] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef("");
  const contentRef = useRef<any>(null);
  const isDirtyRef = useRef(false);
  // Track which note id the refs currently belong to
  const loadedIdRef = useRef<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const res = await api.get(`/note/${id}`);
      return res.data;
    },
  });

  const note = data?.notes ?? data;

  useEffect(() => {
    if (!note) return;
    if (loadedIdRef.current !== id) {
      loadedIdRef.current = id;
      isDirtyRef.current = false;
      titleRef.current = note.title ?? "";
      contentRef.current = note.content ?? null;
      setTitle(note.title ?? "");
    }
  }, [note, id]);

  const saveNow = () => {
    if (!isDirtyRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    updateNote.mutate({
      id: id as string,
      value: { title: titleRef.current, content: contentRef.current },
    });
    isDirtyRef.current = false;
  };

  const scheduleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveNow, 1000);
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveNow();
    };
  }, [id]);

  const handleTitleChange = (newTitle: string) => {
    titleRef.current = newTitle;
    isDirtyRef.current = true;
    setTitle(newTitle);
    scheduleSave();
  };

  const handleContentUpdate = (newContent: any) => {
    contentRef.current = newContent;
    isDirtyRef.current = true;
    scheduleSave();
  };

  const formattedDate = note?.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Loading";

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => {
              saveNow();
              navigate(-1);
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {title || "Untitled"}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Star note"
          >
            <Star size={17} strokeWidth={2} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground aria-expanded:bg-muted"
                  aria-label="More note actions"
                />
              }
            >
              <Ellipsis size={18} strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 size={14} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex w-full justify-center px-4 py-16">
        <div className="flex w-full max-w-3xl min-w-0 flex-col gap-4">
          {isLoading || !note ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-10 w-2/3 rounded-md bg-muted" />
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="h-4 w-5/6 rounded-md bg-muted" />
              <div className="h-4 w-4/6 rounded-md bg-muted" />
            </div>
          ) : (
            <Tiptap
              key={id}
              initialTitle={note.title ?? ""}
              initialContent={note.content ?? null}
              onTitleChange={handleTitleChange}
              onContentUpdate={handleContentUpdate}
              onBlur={saveNow}
            />
          )}
        </div>
      </div>
    </div>
  );
}
