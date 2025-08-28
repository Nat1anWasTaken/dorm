"use client"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, LexicalEditor, SerializedEditorState } from "lexical"
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
    const baseConfig: Omit<InitialConfigType, "editorState"> = {
      namespace: editorConfig.namespace,
      theme: editorConfig.theme,
      nodes: editorConfig.nodes,
      onError: editorConfig.onError,
      editable: editorConfig.editable,
    }

    if (editorState) {
      return { ...baseConfig, editorState }
    }

    const initialSerialized = initialSerializedRef.current
    if (initialSerialized) {
      return {
        ...baseConfig,
        editorState: (editor: LexicalEditor) => {
          const parsed = editor.parseEditorState(
            JSON.stringify(initialSerialized)
          )
          editor.setEditorState(parsed)
        },
      }
    }

    const md = initialMarkdownRef.current
    if (md && md.trim()) {
      return {
        ...baseConfig,
        editorState: () => {
          $convertFromMarkdownString(md, TRANSFORMERS)
        },
      }
    }

    return baseConfig as InitialConfigType
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
