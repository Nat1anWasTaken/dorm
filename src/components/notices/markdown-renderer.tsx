"use client";

import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect } from "react";

import { nodes } from "@/components/blocks/editor-00/nodes";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { editorTheme } from "@/components/editor/themes/editor-theme";

function MarkdownImport({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      // Clear and import markdown content into the editor
      $convertFromMarkdownString(markdown, TRANSFORMERS);
    });
  }, [editor, markdown]);

  return null;
}

export function NoticeMarkdownRenderer({
  markdown,
}: {
  markdown: string;
}) {
  const editorConfig: InitialConfigType = {
    namespace: "NoticeRenderer",
    theme: editorTheme,
    nodes,
    editable: false,
    onError: (error: Error) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <MarkdownImport markdown={markdown} />
      <RichTextPlugin
        contentEditable={<ContentEditable placeholder={""} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
