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
import { useQueryClient } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router";

export function WorkspaceNotes() {
  const { viewType, searchQuery } = useOutletContext<{
    viewType: string;
    searchQuery: string;
  }>();
  const queryClient = useQueryClient();
  const {id}  = useParams()

  const notes = queryClient.getQueryData<any[]>(["notes"])?.filter((data: any) => id == data.notes.workspaceId)

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;

    return notes?.filter((data: any) => {
      const title = (data.notes.title || "untitled").toLowerCase();
      return title.includes(query);
    });
  }, [notes, searchQuery]);

  if (searchQuery && filteredNotes!.length === 0) {
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
              We couldn't find any notes matching "{searchQuery}".
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return viewType == "cards" ? (
    notes?.length == 0 ? (
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
            <EmptyTitle>No notes in the workspace yet</EmptyTitle>
            <EmptyDescription>
              Add notes in your workspace for them to show up here
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    ) : (
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
    )
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
