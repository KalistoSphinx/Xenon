import type { EditorStateSnapshot } from "@tiptap/react";
import type { Editor } from '@tiptap/core'

export function menuBarStateSelector(ctx: EditorStateSnapshot<Editor>){

    return {
        isBold: ctx.editor.isActive('bold') ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
    }
}

export type MenuBarState = ReturnType<typeof menuBarStateSelector>