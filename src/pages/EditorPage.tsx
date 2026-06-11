import Tiptap from "@/components/tiptap";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useUpdateNote } from "@/Repos/notesRepo";

export function EditorPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [starred, setStarred] = useState(false);

    const { data: noteData, isPending } = useQuery({
        queryKey: ["note", id],
        queryFn: async () => {
            const res = await api.get(`/note/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const note = noteData?.notes || noteData;
    const updateNote = useUpdateNote();

    useEffect(() => {
        if (note) setStarred(note.isStarred);
    }, [note?.isStarred]);

    const handleStarToggle = () => {
        const newVal = !starred;
        setStarred(newVal);
        updateNote.mutate({
            id: id!,
            value: { isStarred: newVal },
        });
    };

    const formatDate = (d: string) => {
        if (!d) return "";
        const date = new Date(d);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (isPending) {
        return (
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }

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
                        <p className="truncate text-sm font-medium">{note?.title || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(note?.createdAt)}</p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                    <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Star note"
                        onClick={handleStarToggle}
                    >
                        <Star size={17} strokeWidth={2} fill={starred ? "#fbbf24" : "none"} stroke={starred ? "#fbbf24" : "currentColor"} />
                    </button>
                </div>
            </div>

            <div className="flex w-full justify-center px-4 py-16">
                <div className="flex w-full max-w-3xl min-w-0 flex-col gap-4">
                    <Tiptap noteId={id!} initialTitle={note?.title || ""} initialContent={note?.content} />
                </div>
            </div>
        </div>
    )
}
