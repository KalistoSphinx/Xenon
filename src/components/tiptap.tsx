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
import { common, createLowlight } from "lowlight";
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
import { Plus, X, Copy, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverDescription,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { useUpdateNote } from "@/Repos/notesRepo";
import { useParams } from "react-router";
import type { Workspace } from "@/lib/models";

const lowlight = createLowlight(common);

const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },
});

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView);
  },
});

interface TipTapProps {
  initialContent: any;
  initialTitle: string;
  initialWorkspace?: Workspace | null;
  onTitleChange: (title: string) => void;
  onContentUpdate: (content: any) => void;
  onBlur?: () => void;
}

const Tiptap = ({
  initialTitle,
  initialContent,
  initialWorkspace,
  onTitleChange,
  onContentUpdate,
  onBlur,
}: TipTapProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    initialWorkspace ?? null,
  );
  const [popoverOpen, setPopoverOpen] = useState(false);
  const updateNote = useUpdateNote();
  const queryClient = useQueryClient();
  const { id: noteId } = useParams();

  const editor = useEditor({
    extensions: [
      Document,
      StarterKit,
      Blockquote,
      HorizontalRule,
      BulletList,
      OrderedList,
      TaskList,
      CustomTaskItem.configure({ nested: true }),
      Heading.configure({ levels: [1, 2] }),
      CustomCodeBlock.configure({
        lowlight,
        enableTabIndentation: true,
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "p-1 rounded-[0.4rem] px-[0.3rem] py-[0.1rem]",
        },
      }),
      Placeholder.configure({ placeholder: "Start typing here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent ?? "",
    onUpdate: ({ editor }) => {
      onContentUpdate(editor.getJSON());
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onTitleChange(newTitle);
  };

  const updateNotesListCache = (workspaceData: Workspace | null) => {
    queryClient.setQueryData(["notes"], (old: any) => {
      if (!Array.isArray(old)) return old;
      return old.map((item: any) =>
        item.notes?.id === noteId
          ? { ...item, workspaces: workspaceData ?? {} }
          : item,
      );
    });
  };

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setPopoverOpen(false);
    updateNotesListCache(workspace);
    updateNote.mutate({
      id: noteId!,
      value: { workspaceId: workspace.id },
    });
  };

  const handleWorkspaceRemove = () => {
    setSelectedWorkspace(null);
    updateNotesListCache(null);
    updateNote.mutate({
      id: noteId!,
      value: { workspaceId: null },
    });
  };

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await api.get("/workspaces");
      return res.data;
    },
  });

  return (
    <>
      <div className="group min-w-0">
        <div className="mb-2 flex items-center gap-2">
          {selectedWorkspace ? (
            <div className="flex gap-1 group/badge w-full">
              <Badge variant="outline" className="flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: selectedWorkspace.color }}
                />
                <span className="text-xs">{selectedWorkspace.name}</span>
              </Badge>
              <button
                type="button"
                aria-label="Remove workspace"
                className="opacity-0 group-hover/badge:opacity-100 rounded-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
                onClick={handleWorkspaceRemove}
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                render={
                  <Plus
                    size={18}
                    className={`outline-none transition-opacity duration-200 ease-in-out text-muted-foreground ${
                      selectedWorkspace
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    strokeWidth={2}
                  />
                }
              />
              <PopoverContent align="start" className="border border-border">
                <PopoverHeader>
                  <PopoverDescription>Your Workspaces</PopoverDescription>
                </PopoverHeader>
                <div className="flex flex-wrap gap-2">
                  {workspaces.map(
                    (workspace: {
                      id: string;
                      name: string;
                      color: string;
                    }) => (
                      <Badge
                        key={workspace.id}
                        variant={"outline"}
                        className="cursor-pointer flex gap-1.5"
                        onClick={() => handleWorkspaceSelect(workspace)}
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: workspace.color }}
                        />
                        {workspace.name}
                      </Badge>
                    ),
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <textarea
          rows={1}
          value={title}
          onChange={handleTitleChange}
          className="w-full max-w-full resize-none overflow-hidden wrap-break-word text-[38px] font-bold outline-none field-sizing-content"
          name="title"
          placeholder="Title"
          onBlur={onBlur}
        />
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
        onBlur={onBlur}
      />
    </>
  );
};

function TaskItemView(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="ml-2 flex items-center gap-2">
      <div contentEditable={false} className="my-2">
        <Checkbox
          className="rounded-sm dark:bg-muted dark:text-primary dark:data-checked:border-violet-600 dark:data-checked:bg-violet-600"
          checked={props.node.attrs.checked}
          onCheckedChange={(checked) => {
            props.updateAttributes({ checked: !!checked });
          }}
        />
      </div>
      <NodeViewContent
        className={`ml-0.5 flex-1 ${
          props.node.attrs.checked ? "line-through text-muted-foreground" : ""
        }`}
      />
    </NodeViewWrapper>
  );
}

function CodeBlockView({ node }: NodeViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = node.textContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="relative rounded-lg bg-muted py-3 px-4 text-sm my-4">
      <button
        contentEditable={false}
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors z-10"
        title="Copy code"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre className="my-0! bg-transparent! p-0! overflow-x-auto">
        {/* @ts-ignore */}
        <NodeViewContent as="code"
          className={
            node.attrs.language ? `language-${node.attrs.language}` : ""
          }
        />
      </pre>
    </NodeViewWrapper>
  );
}

export default Tiptap;
