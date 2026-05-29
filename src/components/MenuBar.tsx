import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { menuBarStateSelector } from "./MenuBarState.ts";
import { Toggle } from "./ui/toggle.tsx";
import { BoldIcon, Italic } from "lucide-react";

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor) {
    return null;
  }

  const customStyle =
    "rounded-lg p-2 hover:bg-transparent aria-pressed:text-violet-300 aria-pressed:bg-violet-500/40";

  return (
    <div className="flex gap-1 top-2 z-100 bg-muted sticky p-2 rounded-xl w-fit border border-border">
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isBold}
        onPressedChange={() => editor!.chain().focus().toggleBold().run()}
        aria-label="Toggle Bold"
      >
        <BoldIcon strokeWidth={2}/>
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isItalic}
        onPressedChange={() => editor!.chain().focus().toggleItalic().run()}
        aria-label="Toggle Bold"
      >
        <Italic strokeWidth={2} />
      </Toggle>
    </div>
  );
};
