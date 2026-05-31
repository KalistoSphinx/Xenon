import type { EditorStateSnapshot } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    isBold: ctx.editor.isActive("bold") ?? false,
    isItalic: ctx.editor.isActive("italic") ?? false,
    isUnderline: ctx.editor.isActive("underline") ?? false,
    canUndo: ctx.editor.can().chain().undo().run() ?? false,
    canRedo: ctx.editor.can().chain().redo().run() ?? false,
  };
}

export type MenuBarState = ReturnType<typeof menuBarStateSelector>;
