import { NoteCard } from "@/components/custom/NoteCard";
import { NoteList } from "@/components/custom/NoteList";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Delete02Icon, Warning } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { useMemo } from "react";
import { SearchX } from "lucide-react";
import { api } from "@/lib/api";

export function TrashNotes() {
  const { viewType, searchQuery } = useOutletContext<{
    viewType: string;
    searchQuery: string;
  }>();

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await api.get("/note");
      return res.data;
    },
  });

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes?.filter((data: any) => data.notes.trashedAt);

    return notes?.filter((data: any) => {
      const title = (data.notes.title || "untitled").toLowerCase();
      return title.includes(query);
    });
  }, [notes, searchQuery]);

  if (searchQuery && filteredNotes?.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX
                className="size-5 text-muted-foreground"
                strokeWidth={2}
              />
            </EmptyMedia>
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>
              We couldn't find any starred notes matching "{searchQuery}".
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <>
      {filteredNotes?.length == 0 ? (
    <div className="h-full flex flex-col items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon
              className="size-5"
              icon={Delete02Icon}
              strokeWidth={2}
            />
          </EmptyMedia>
          <EmptyTitle>Trash is empty</EmptyTitle>
          <EmptyDescription>
            No notes in the trash.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ) : viewType == "cards" ? (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-3">
      {filteredNotes?.map((data: any, i: number) => (
        <NoteCard
          key={data.notes.id}
          index={i}
          note={data.notes}
          workspace={data.workspaces}
        />
      ))}
    </div>
  ) : (
    <div className="flex flex-col gap-4 p-4">
      {filteredNotes?.map((data: any, i: number) => (
        <NoteList
          key={data.notes.id}
          index={i}
          note={data.notes}
          workspace={data.workspaces}
        />
      ))}
    </div>
  )}

      <div className="sticky bottom-6 z-10 mx-auto mt-auto mb-6 px-4 py-2.5 rounded-lg w-fit text-sm bg-background/95 backdrop-blur-md border shadow-sm">
        <span className="flex items-center gap-2 font-medium">
          <HugeiconsIcon icon={Warning} size={16} className="text-muted-foreground" />
          Trashed Notes are permanently deleted after 30 days.
        </span>
      </div>
    </>
  )
}
