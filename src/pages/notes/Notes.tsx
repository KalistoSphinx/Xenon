import { NoteCard } from "@/components/custom/NoteCard";
import { NoteList } from "@/components/custom/NoteList";
import { useOutletContext } from "react-router";

export function AllNotes(){

    const viewType = useOutletContext()

    return (
        viewType == "cards" ? <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-3">
            <NoteCard />
            <NoteCard />
            <NoteCard />
            <NoteCard />
            <NoteCard />
            <NoteCard />
        </div> : <div className="flex flex-col gap-4 p-4">
            <NoteList />
            <NoteList />
            <NoteList />
            <NoteList />
            <NoteList />
        </div>
    )
}