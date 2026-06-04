import type { EditorStateSnapshot } from "@tiptap/react";
import type { Editor } from "@tiptap/core";

export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    isBold: ctx.editor.isActive("bold") ?? false,
    isItalic: ctx.editor.isActive("italic") ?? false,
    isUnderline: ctx.editor.isActive("underline") ?? false,
    isHighlight: ctx.editor.isActive("highlight") ?? false,
    isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
    isHeading1: ctx.editor.isActive("heading", {level: 1}) ?? false,
    isHeading2: ctx.editor.isActive("heading", {level: 2}) ?? false,
    isHeading3: ctx.editor.isActive("heading", {level: 3}) ?? false,
    isBulletList: ctx.editor.isActive("bulletList") ?? false,
    isOrderedList: ctx.editor.isActive("orderedList") ?? false,
    isTaskList: ctx.editor.isActive("taskList") ?? false,
    isBlockquote: ctx.editor.isActive("blockquote") ?? false,
    canUndo: ctx.editor.can().chain().undo().run() ?? false,
    canRedo: ctx.editor.can().chain().redo().run() ?? false,
  };
}

export type MenuBarState = ReturnType<typeof menuBarStateSelector>;
