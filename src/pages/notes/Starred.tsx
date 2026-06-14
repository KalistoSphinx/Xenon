import { NoteCard } from "@/components/custom/NoteCard";
import { NoteList } from "@/components/custom/NoteList";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Note02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { useMemo } from "react";
import { SearchX } from "lucide-react";
import { api } from "@/lib/api";

export function StarredNotes() {
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
    if (!query) return notes?.filter((data: any) => data.notes.isStarred);

    return notes?.filter((data: any) => {
      const title = (data.notes.title || "untitled").toLowerCase();
      return title.includes(query);
    });
  }, [notes, searchQuery]);

  if (searchQuery && filteredNotes?.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
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

  return filteredNotes?.length == 0 ? (
    <div className="h-full flex flex-col items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon
              className="size-5"
              icon={Note02Icon}
              strokeWidth={2}
            />
          </EmptyMedia>
          <EmptyTitle>No Starred Notes Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t starred any notes yet. your first note.
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
  );
}
