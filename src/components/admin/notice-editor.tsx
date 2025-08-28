"use client";

import { useState, useEffect, useCallback } from "react";
import { EditorState, SerializedEditorState } from "lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { Editor } from "@/components/blocks/editor-00/editor";

interface NoticeEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function NoticeEditor({ 
  content, 
  onChange 
}: NoticeEditorProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState>();

  // Initialize editor with markdown content
  useEffect(() => {
    if (content && content.trim()) {
      // Create a basic serialized state for initial content
      const initialState = {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: content,
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      } as unknown as SerializedEditorState;
      setEditorState(initialState);
    }
  }, [content]);

  const handleEditorChange = useCallback((newEditorState: EditorState) => {
    // Convert editor state to markdown and call onChange
    newEditorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onChange(markdown);
    });
  }, [onChange]);

  const handleSerializedChange = useCallback((serializedState: SerializedEditorState) => {
    setEditorState(serializedState);
  }, []);

  return (
    <div className="min-h-[300px]">
      <Editor
        editorSerializedState={editorState}
        onChange={handleEditorChange}
        onSerializedChange={handleSerializedChange}
      />
    </div>
  );
}