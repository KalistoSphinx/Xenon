import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { MenuBar } from "./MenuBar";
import { Input } from "@base-ui/react";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ],
    content: "",
  });

  return (
    <>
      <textarea

        rows={1}
        className={"text-[46px] font-bold outline-none resize-none field-sizing-content"}
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

export default Tiptap;
