"use client"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState } from "lexical"
import { useMemo, useRef } from "react"
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown"

import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

import { nodes } from "./nodes"
import { Plugins } from "./plugins"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error)
  },
}

export function Editor({
  editorState,
  editorSerializedState,
  initialMarkdown,
  onChange,
  onSerializedChange,
}: {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  initialMarkdown?: string
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void
}) {
  const initialMarkdownRef = useRef(initialMarkdown)
  const initialSerializedRef = useRef(editorSerializedState)
  const initialConfig = useMemo<InitialConfigType>(() => {
    // Build a stable initialConfig that doesn't change on every render
    const cfg: InitialConfigType = { ...editorConfig }

    if (editorState) {
      cfg.editorState = editorState
      return cfg
    }

    const initialSerialized = initialSerializedRef.current
    if (initialSerialized) {
      cfg.editorState = (editor) => {
        const parsed = editor.parseEditorState(
          JSON.stringify(initialSerialized)
        )
        editor.setEditorState(parsed)
      }
      return cfg
    }

    const md = initialMarkdownRef.current
    if (md && md.trim()) {
      cfg.editorState = () => {
        $convertFromMarkdownString(md, TRANSFORMERS)
      }
    }
    return cfg
  }, [editorState])

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow min-h-72">
      <LexicalComposer initialConfig={initialConfig}>
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState)
              onSerializedChange?.(editorState.toJSON())
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
