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

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await api.get("/note");
      console.log(res.data)
      return res.data;
    },
  });

  return viewType == "cards" ? (
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
        {notes.map((note: any) => <NoteCard/>)}
      </div>
    )
  ) : (
    <div className="flex flex-col gap-4 p-4">
      <NoteList />
      <NoteList />
      <NoteList />
      <NoteList />
      <NoteList />
    </div>
  );
}
