import { NoteCard} from "@/components/custom/NoteCard";
import { NoteList } from "@/components/custom/NoteList";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Note02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react";

export function AllNotes() {
  const viewType = useOutletContext();

  const { data: notes = [], isPending } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await api.get("/note");
      return res.data;
    },
  });

  return isPending ? <div></div> : viewType == "cards" ? (
    notes.length == 0 ? (
      <div className="h-full flex flex-col items-center justify-center">
        <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon className="size-5" icon={Note02Icon} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle>No Notes Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any notes yet. Get started by creating
          your first note.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
      </div>
    ) : (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-3">
        {notes.map((data: any, i: number) => <NoteCard key={data.notes.id} index={i} note={data.notes} workspace={data.workspaces}/>)}
      </div>
    )
  ) : (
    <div className="flex flex-col gap-4 p-4">
      <NoteList index={0} />
      <NoteList index={1} />
      <NoteList index={2} />
      <NoteList index={3} />
      <NoteList index={4} />
    </div>
  );
}
