"use client"

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { TRANSFORMERS, $convertFromMarkdownString } from "@lexical/markdown"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { nodes } from "@/components/blocks/editor-00/nodes"

function MarkdownImport({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.update(() => {
      // Clear and import markdown content into the editor
      $convertFromMarkdownString(markdown, TRANSFORMERS)
    })
  }, [editor, markdown])

  return null
}

export function NoticeMarkdownRenderer({
  markdown,
  className,
  minHeight = false,
}: {
  markdown: string
  className?: string
  minHeight?: boolean
}) {
  const editorConfig: InitialConfigType = {
    namespace: "NoticeRenderer",
    theme: editorTheme,
    nodes,
    editable: false,
    onError: (error: Error) => console.error(error),
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <MarkdownImport markdown={markdown} />
      <RichTextPlugin
        contentEditable={
          <div>
            <ContentEditable
              placeholder={""}
              className={
                className ??
                `ContentEditable__root relative block ${minHeight ? "min-h-72 min-h-full" : ""} overflow-auto px-8 py-4 focus:outline-none`
              }
            />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  )
}
