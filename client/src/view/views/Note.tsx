import { map } from "rambda"
import { useStore } from "../../model/store"
import { navigateTo } from "../../model/router"
import { ReactNode } from "react"
import Markdown from "../components/Markdown"
import { NoteCard } from "./Notes"
import { SmartActionButton } from "../Ui"
import { GetShitDoneIcon } from "../components/Icons"

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

  const title = note.text.split("\n")[0]
  const localDate = new Date(note.createdAt).toLocaleString()

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col gap-2 p-4 rounded-xl bg-background-secondary overflow-auto">
        <div className="flex items-end">
          <div
            className={
              "flex-1 font-mono text-xs font-bold line-clamp-1 " +
              (note.smartNote ? "text-color-accent" : "")
            }
          >
            <span>{note.smartNote ? "Your generated TODOs" : title}</span>
          </div>
          <div className="flex-1 text-right font-mono text-xs">{localDate}</div>
        </div>
        <div className="border-b border-color-text-primary"></div>
        <Markdown className="prose prose-neutral dark:prose-invert my-4" content={note.text} />
        {/* Date and categories */}
        <div className="flex gap-1 w-full flex-wrap">
          {viewTag(new Date(note.createdAt).toLocaleString())}
          {note.createdAt !== note.updatedAt && viewTag(new Date(note.updatedAt).toLocaleString())}
          {map(viewTag, note.categories)}
        </div>
        {/* Tags */}
        <div className="flex gap-1 w-full flex-wrap pb-4">{map(viewTag, note.tags)}</div>
      </div>
      {/* Smart note actions */}
      {note.smartNote && (
        <SmartActionButton
          onClick={() => {
            // todo: publish({ type: "smart-notes:create-todo-list" })
          }}
          text="Help me get shit done"
          icon={<GetShitDoneIcon />}
        />
      )}
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
