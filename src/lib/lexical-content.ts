import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type LexicalChild = Record<string, unknown>

function textNode(text: string, format = 0): LexicalChild {
  return {
    type: 'text',
    text,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

function paragraphNode(...children: LexicalChild[]): LexicalChild {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

function headingNode(tag: 'h2' | 'h3', text: string): LexicalChild {
  return {
    type: 'heading',
    tag,
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function listItemNode(text: string): LexicalChild {
  return {
    type: 'listitem',
    children: [paragraphNode(textNode(text))],
    direction: 'ltr',
    format: '',
    indent: 0,
    value: 1,
    version: 1,
  }
}

function listNode(items: string[]): LexicalChild {
  return {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    children: items.map(listItemNode),
    direction: 'ltr',
    format: '',
    indent: 0,
    start: 1,
    version: 1,
  }
}

export function lexicalFromBlocks(
  blocks: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; level: 2 | 3; text: string }
    | { type: 'list'; items: string[] }
  >,
): SerializedEditorState {
  const children: LexicalChild[] = blocks.map((block) => {
    if (block.type === 'paragraph') return paragraphNode(textNode(block.text))
    if (block.type === 'heading') return headingNode(block.level === 2 ? 'h2' : 'h3', block.text)
    return listNode(block.items)
  })

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as SerializedEditorState
}

/** Simple markdown-ish text → Lexical (## h2, ### h3, - bullets, blank lines = paragraphs). */
export function parseSimpleMarkdownToLexical(source: string): SerializedEditorState {
  const blocks: Parameters<typeof lexicalFromBlocks>[0] = []
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  let paragraph: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    const text = paragraph.join(' ').trim()
    if (text) blocks.push({ type: 'paragraph', text })
    paragraph = []
  }

  const flushList = () => {
    if (listItems.length) blocks.push({ type: 'list', items: listItems })
    listItems = []
  }

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) {
      flushParagraph()
      flushList()
      continue
    }

    if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', level: 2, text: line.slice(3).trim() })
      continue
    }

    if (line.startsWith('### ')) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', level: 3, text: line.slice(4).trim() })
      continue
    }

    if (line.startsWith('- ')) {
      flushParagraph()
      listItems.push(line.slice(2).trim())
      continue
    }

    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()

  if (blocks.length === 0) {
    blocks.push({ type: 'paragraph', text: source.trim() || '' })
  }

  return lexicalFromBlocks(blocks)
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}
