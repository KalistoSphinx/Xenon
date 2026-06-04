import Tiptap from "@/components/tiptap";

export function EditorPage(){
    return (
        <div className="flex justify-center mt-30">
            <div className="w-[50%] flex flex-col gap-4">
                <Tiptap />
            </div>
        </div>
    )
}