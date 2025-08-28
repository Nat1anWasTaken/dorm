"use client";

import { useCallback } from "react";
import { EditorState } from "lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { Editor } from "@/components/blocks/editor-00/editor";

interface NoticeEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function NoticeEditor({ content, onChange }: NoticeEditorProps) {
  const handleEditorChange = useCallback(
    (newEditorState: EditorState) => {
      // Convert editor state to markdown and call onChange
      newEditorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onChange(markdown);
      });
    },
    [onChange]
  );

  return (
    <div className="min-h-[300px]">
      <Editor initialMarkdown={content} onChange={handleEditorChange} />
    </div>
  );
}
