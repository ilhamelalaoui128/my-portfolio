import { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered,
} from 'lucide-react'

function Toolbar({ editor }) {
  if (!editor) return null

  const btnClass = (active) =>
    `flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
      active
        ? 'bg-accent/15 text-accent'
        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300'
    }`

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200/80 px-3 py-2 dark:border-gray-700">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Gras">
        <Bold size={15} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italique">
        <Italic size={15} />
      </button>
      <span className="mx-1 w-px bg-gray-200 dark:bg-gray-700" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Titre 1">
        <Heading1 size={15} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Titre 2">
        <Heading2 size={15} />
      </button>
      <span className="mx-1 w-px bg-gray-200 dark:bg-gray-700" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Liste">
        <List size={15} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Liste numérotée">
        <ListOrdered size={15} />
      </button>
    </div>
  )
}

export default function RichTextEditor({ value, onChange, placeholder = 'Écrivez votre contenu…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const setContent = useCallback((html) => {
    if (editor && html !== editor.getHTML()) {
      editor.commands.setContent(html || '')
    }
  }, [editor])

  useEffect(() => {
    if (value !== undefined && editor) {
      setContent(value)
    }
  }, [value, editor, setContent])

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white transition focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 dark:border-gray-700 dark:bg-[#18181C]">
      <Toolbar editor={editor} />
      <div className="[&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-gray-700 [&_.ProseMirror]:outline-none dark:[&_.ProseMirror]:text-gray-300 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_h1]:my-3 [&_.ProseMirror_h1]:text-lg [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:my-2 [&_.ProseMirror_h2]:text-base [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-4 [&_.ProseMirror_li]:my-1 [&_.ProseMirror]:space-y-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
