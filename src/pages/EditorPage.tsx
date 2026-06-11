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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Ellipsis, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function EditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const updateNote = useUpdateNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: data } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await api.get(`/note/${id}`);
      return res.data;
    },
    initialData: () => {
      const cachedNotes = queryClient.getQueryData<any[]>(["notes"]);
      const cachedNote = cachedNotes?.find((n) => n.notes.id === id);
      return cachedNote ? cachedNote.notes : undefined;
    },
  });

  useEffect(() => {
    if (data && !isDirty) {
      setTitle(data?.notes?.title);
      setContent(data?.notes?.content);
    }
  }, [data]);

  useEffect(() => {
    if (!isDirty) return;

    // Set a timer to execute the save after 1 second of inactivity
    const timer = setTimeout(() => {
      console.log("Auto-saving to DB...");

      updateNote.mutate({
        id: id as string,
        value: {
          title: title,
          content: content,
        },
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, content, isDirty, id]);

  const handleTitleChange = (title: string) => {
    setTitle(title);
    setIsDirty(true);
  };

  const handleContentUpdate = (jsonContent: any) => {
    setContent(jsonContent);
    setIsDirty(true);
  };

  const formattedDate =
    new Date(data?.notes?.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) || "Loading";

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title || "Untitled"}</p>
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
          <Tiptap 
            title={title}
            content={content}
            titleChange={handleTitleChange}
            onUpdate={handleContentUpdate}
          />
        </div>
      </div>
    </div>
  );
}
