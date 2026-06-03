import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { menuBarStateSelector } from "./MenuBarState.ts";
import { Toggle } from "./ui/toggle.tsx";
import { AlignCenter, AlignLeft, AlignRight, BoldIcon, Code2Icon, Heading1, Heading2,HighlighterIcon, Italic, List, ListOrdered, ListTodo, Minus, Redo2, UnderlineIcon, Undo2 } from "lucide-react";
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
    "rounded-lg p-2 hover:bg-transparent aria-pressed:bg-violet-600/70";

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
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isBulletList}
        onPressedChange={() => editor!.chain().focus().toggleBulletList().run()}
        aria-label="Toggle Bullet List"
      >
        <List strokeWidth={2} />
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isOrderedList}
        onPressedChange={() => editor!.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle Ordered List"
      >
        <ListOrdered strokeWidth={2} />
      </Toggle>
      <Toggle
        size={"sm"}
        className={customStyle}
        pressed={editorState.isTaskList}
        onPressedChange={() => editor!.chain().focus().toggleTaskList().run()}
        aria-label="Toggle Task List"
      >
        <ListTodo strokeWidth={2} />
      </Toggle>
      <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus />
        </Button>
      <Separator orientation="vertical" className={"ml-1"} />
      <div className="flex items-center">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().toggleTextAlign('left').run()}
        >
          <AlignLeft></AlignLeft>
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().toggleTextAlign("center").run()}
        >
          <AlignCenter />
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().toggleTextAlign("right").run()}
        >
          <AlignRight />
        </Button>
      </div>
      <Separator orientation="vertical" className={"mr-1.5"} />
    </div>
    
  );
};
