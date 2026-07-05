'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function PostRichText({ data }: { data: SerializedEditorState }) {
  return (
    <RichText
      data={data}
      className="blog-content"
    />
  )
}
