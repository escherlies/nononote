import { map } from "rambda"
import { useStore } from "../../model/store"
import { navigateTo } from "../../model/router"
import { ReactNode } from "react"
import Markdown from "../components/Markdown"

export function ViewNote({ noteId }: { noteId: string }) {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)

  const notes = [...storedNotes, ...unsyncedNewNotes]

  const note = notes.find((note) => note.id === noteId)

  if (!note) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto">Note not found</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      <Markdown
        className="prose prose-neutral whitespace-pre-wrap break-words"
        content={note.text}
      />
      <div className="mt-auto w-full flex gap-1 flex-col">
        {/* Date and categories */}
        <div className="flex gap-1 w-full flex-wrap">
          {viewTag(new Date(note.createdAt).toLocaleString())}
          {note.createdAt !== note.updatedAt && viewTag(new Date(note.updatedAt).toLocaleString())}
          {map(viewTag, note.categories)}
        </div>
        {/* Tags */}
        <div className="flex gap-1 w-full flex-wrap">{map(viewTag, note.tags)}</div>
      </div>
    </div>
  )
}

function viewTag(tag: string): ReactNode {
  return (
    <div
      key={tag}
      className="text-xs bg-color-accent px-0.5 text-white uppercase dark:text-background-primary cursor-pointer"
      onClick={() => navigateTo({ tag: "Search", query: tag })}
    >
      {tag}
    </div>
  )
}
