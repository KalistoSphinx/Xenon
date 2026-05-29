import Tiptap from "@/components/tiptap";
import { Input } from "@base-ui/react";

export function EditorPage(){
    return (
        <div className="flex justify-center mt-30">
            <div className="w-1/2 flex flex-col gap-4">
                <Tiptap />
            </div>
        </div>
    )
}