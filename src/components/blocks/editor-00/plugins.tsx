import { useCallback, useRef } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { TRANSFORMERS } from "@lexical/markdown"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"

export function Plugins() {
  const floatingAnchorElem = useRef<HTMLDivElement | null>(null)
  const onRef = useCallback((elem: HTMLDivElement | null) => {
    // store without causing re-renders
    floatingAnchorElem.current = elem
  }, [])

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"開始輸入…"} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
      {/* actions plugins */}
    </div>
  )
}
