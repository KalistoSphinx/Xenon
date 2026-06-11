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
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { all, createLowlight } from "lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import {
  BulletList,
  OrderedList,
  TaskItem,
  TaskList,
} from "@tiptap/extension-list";
import Document from "@tiptap/extension-document";
import { Checkbox } from "./ui/checkbox";

import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverDescription,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUpdateNote } from "@/Repos/notesRepo";
import { useEffect, useRef, useState } from "react";

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView);
  },
});

const Tiptap = ({ noteId, initialTitle = "", initialContent = null }: {
  noteId: string;
  initialTitle?: string;
  initialContent?: any;
}) => {
  const [title, setTitle] = useState(initialTitle);
  const updateNote = useUpdateNote();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceSave = (value: any) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateNote.mutate({ id: noteId, value });
    }, 800);
  };

  const editor = useEditor({
    extensions: [
      Document,
      StarterKit,
      Blockquote,
      HorizontalRule,
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
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      debounceSave({ content: html });
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
    setTitle(initialTitle);
  }, [noteId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debounceSave({ title: newTitle });
  };

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await api.get("/workspaces");
      return res.data;
    },
    enabled: false,
  });

  return (
    <>
      <div className="group min-w-0">
        <Popover>
          <PopoverTrigger
            render={
              <Plus
                size={18}
                className="mb-2 outline-none transition-opacity duration-200 ease-in-out opacity-0 text-muted-foreground group-hover:opacity-100 "
                strokeWidth={2}
              />
            }
          />
          <PopoverContent align="start" className={" border border-border"}>
            <PopoverHeader>
              <PopoverDescription>Your Workspaces</PopoverDescription>
            </PopoverHeader>
            <div className="flex flex-wrap gap-2">
              {workspaces.map((workspace : {
                id: string,
                name: string, 
                color: string
              }) => (
                <Badge
                  key={workspace.id}
                  variant={"outline"}
                  className="cursor-pointer flex gap-1.5"
                >
                  <span className="size-1.5 rounded-full" style={{
                    backgroundColor: workspace.color
                  }} />
                  {workspace.name}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <textarea
          rows={1}
          className={
            "w-full max-w-full resize-none overflow-hidden wrap-break-word text-[38px] font-bold outline-none field-sizing-content"
          }
          name="title"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        ></textarea>
      </div>
      <MenuBar editor={editor} />
      <EditorContent
        className="
    w-full min-w-0 max-w-full
    [&_.ProseMirror]:min-h-60
    [&_.ProseMirror]:max-w-full
    [&_.ProseMirror]:wrap-break-word
    [&_.ProseMirror]:whitespace-pre-wrap
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror_*]:max-w-full
  "
        editor={editor}
      />
    </>
  );
};

function TaskItemView(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="ml-2 flex items-center gap-2">
      <div contentEditable={false} className="my-2">
        <Checkbox
          className={
            "rounded-sm dark:bg-muted dark:text-primary dark:data-checked:border-violet-600 dark:data-checked:bg-violet-600"
          }
          checked={props.node.attrs.checked}
          onCheckedChange={(checked) => {
            props.updateAttributes({
              checked: !!checked,
            });
          }}
        />
      </div>
      <NodeViewContent
        className={`ml-0.5 flex-1 ${props.node.attrs.checked ? "line-through text-muted-foreground" : ""}`}
      />
    </NodeViewWrapper>
  );
}

export default Tiptap;
