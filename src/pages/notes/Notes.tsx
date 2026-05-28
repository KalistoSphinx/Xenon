import { NoteCard } from "@/components/custom/NoteCard";

export function AllNotes(){
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-3">
            <NoteCard />
            <NoteCard />
            <NoteCard />
            <NoteCard />
            <NoteCard />
            <NoteCard />
        </div>
    )
}