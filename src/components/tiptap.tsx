import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { Highlight } from "@tiptap/extension-highlight";
import { Heading } from "@tiptap/extension-heading";
import { MenuBar } from "./MenuBar";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  BulletList,
  OrderedList,
  TaskItem,
  TaskList,
} from "@tiptap/extension-list";
import Document from "@tiptap/extension-document";
import { Checkbox } from "./ui/checkbox";

import { ReactNodeViewRenderer } from "@tiptap/react";

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView);
  },
});

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Document,
      StarterKit,
      BulletList,
      OrderedList,
      TaskList,
      CustomTaskItem.configure({
        nested: true,
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(all),
        enableTabIndentation: true,
        HTMLAttributes: {
          class: "rounded-lg bg-muted py-[0.75rem] px-[1rem] text-sm my-[1rem]",
        },
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "p-1 rounded-[0.4rem] px-[0.3rem] py-[0.1rem]",
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
  });

  return (
    <>
      <textarea
        rows={1}
        className={
          "text-[38px] font-bold outline-none resize-none field-sizing-content"
        }
        name="title"
        placeholder="Title"
      ></textarea>
      <MenuBar editor={editor} />
      <EditorContent
        className="
        text-lg
    [&_.ProseMirror]:outline-none
  "
        editor={editor}
      />
      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
    </>
  );
};

function TaskItemView(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="flex items-center gap-2">
      <div contentEditable={false} className="my-2">
        <Checkbox
        className={"rounded-sm dark:bg-muted dark:text-primary dark:data-checked:border-violet-600 dark:data-checked:bg-violet-600"}
        checked={props.node.attrs.checked}
        onCheckedChange={(checked) => {
          props.updateAttributes({
            checked: !!checked,
          });
        }}
      />
      </div>
      <NodeViewContent className={`ml-0.5 flex-1 ${props.node.attrs.checked ? "line-through text-muted-foreground" : ""}`} />
    </NodeViewWrapper>
  );
}

export default Tiptap;
