import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { menuBarStateSelector } from "./MenuBarState.ts";
import { Toggle } from "./ui/toggle.tsx";
import { BoldIcon, Code2Icon, Heading1, Heading2,HighlighterIcon, Italic, Redo2, UnderlineIcon, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "./ui/separator.tsx";

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
    <div className="flex flex-wrap gap-1 items-center top-2 z-100 bg-muted sticky p-2 rounded-xl w-fit max-w-full border border-border">
      <div className="flex items-center">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <Undo2></Undo2>
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          <Redo2></Redo2>
        </Button>
      </div>
      <Separator orientation="vertical" className={"mr-1.5"} />
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isBold}
        onPressedChange={() => editor!.chain().focus().toggleBold().run()}
        aria-label="Toggle Bold"
      >
        <BoldIcon strokeWidth={2} />
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
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isUnderline}
        onPressedChange={() => editor!.chain().focus().toggleUnderline().run()}
        aria-label="Toggle Bold"
      >
        <UnderlineIcon strokeWidth={2} />
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isHighlight}
        onPressedChange={() => editor!.chain().focus().toggleHighlight({color: "#FACC1560"}).run()}
        aria-label="Toggle Highlight"
      >
        <HighlighterIcon strokeWidth={2} />
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isCodeBlock}
        onPressedChange={() => editor!.chain().focus().toggleCodeBlock().run()}
        aria-label="Toggle Code"
      >
        <Code2Icon strokeWidth={2} />
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isHeading1}
        onPressedChange={() => editor!.chain().focus().toggleHeading({level: 1}).run()}
        aria-label="Toggle Heading 1"
      >
        <Heading1 strokeWidth={2} />
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isHeading2}
        onPressedChange={() => editor!.chain().focus().toggleHeading({level: 2}).run()}
        aria-label="Toggle Heading 2"
      >
        <Heading2 strokeWidth={2} />
      </Toggle>
    </div>
  );
};
