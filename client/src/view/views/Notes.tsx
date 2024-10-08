import { head, map, prop, reverse, sortBy } from "rambda"
import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"
import { Note } from "../../../../server/src/data/note"
import { UnsyncedIcon } from "../components/Icons"
import { MyComponent } from "./Halo"

const setIsCached = (isNew: boolean) => (note: Note) => {
  return {
    ...note,
    isNew,
  }
}

export const ViewNotes = () => {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)
  const unsyncedUpdatedNotes = useStore((state) => state.unsyncedUpdatedNotes)

  const allNotes = [
    ...map(setIsCached(false), storedNotes),
    ...map(setIsCached(true), unsyncedNewNotes),
    ...map(setIsCached(true), unsyncedUpdatedNotes),
  ]

  const notesWithoutDeleted = allNotes.filter((note) => !note.deleted)

  const notes = reverse(sortBy(prop("createdAt"), notesWithoutDeleted))

  return (
    <div className="flex flex-col gap-10 w-full">
      {map((note) => {
        const lines = note.text
          // Split the text into lines
          .split("\n")
          // Remove links and special characters
          .map((line) => {
            const isLink = line.includes("http")
            if (isLink) {
              // Keep only the domain name
              return line.split("/")[2]
            } else {
              // Replace all non-alphanumeric characters exept whitespaces with an empty string
              return line.replace(/[^a-zA-Z0-9\s]/g, "")
            }
          })
          // Remove empty lines
          .filter((line) => line.trim() !== "")

        const firstLine = head(lines)

        return <NoteCard key={note.id} note={note} title={firstLine} />
      }, notes)}
    </div>
  )
}

export const ViewLastNoteOrCreatingNote = () => {
  const isCreatingNote = useStore((state) => state.isCreatingNote)

  if (isCreatingNote.tag === "yes") {
    return <ViewIsCreatingNote />
  }

  return <ViewLastNote />
}

export const ViewIsCreatingNote = () => {
  return (
    <MyComponent>
      <div className="flex flex-col items-center justify-center w-full h-full text-white rounded-xl">
        <div className="text-xs">One sec, </div>
        <div className="font-mono">artificial neurons firing</div>
      </div>
    </MyComponent>
  )
}

export const ViewLastNote = () => {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)
  const unsyncedUpdatedNotes = useStore((state) => state.unsyncedUpdatedNotes)

  const allNotes = [
    ...map(setIsCached(false), storedNotes),
    ...map(setIsCached(true), unsyncedNewNotes),
    ...map(setIsCached(true), unsyncedUpdatedNotes),
  ]

  const notesWithoutDeleted = allNotes.filter((note) => !note.deleted)

  const notes = reverse(sortBy(prop("updatedAt"), notesWithoutDeleted))

  const lastNote = head(notes)

  if (!lastNote) {
    return <div>No notes</div>
  }

  return <NoteCard id="last-note" note={lastNote} title="Last Note" />
}

type CardProps = {
  note: Note & { isNew: boolean }
  title: string
} & React.HTMLAttributes<HTMLDivElement>

export const NoteCard = ({ note, title, ...props }: CardProps) => {
  const localDate = new Date(note.updatedAt).toLocaleDateString()

  return (
    <div
      tabIndex={0}
      role="button"
      className="flex flex-col gap-2 px-5 py-4 rounded-xl bg-background-secondary cursor-pointer"
      onClick={() => navigateTo(tag("Note", { id: note.id }))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigateTo(tag("Note", { id: note.id }))
        }
        // Up and down arrow keys
        if (e.key === "ArrowDown") {
          ;(e.currentTarget.nextSibling as HTMLElement)?.focus()
        }
        if (e.key === "ArrowUp") {
          ;(e.currentTarget.previousSibling as HTMLElement)?.focus()
        }
      }}
      {...props}
    >
      <div className="flex items-end">
        <div
          className={
            "flex-grow font-mono text-xs font-bold line-clamp-1 " +
            (note.smartNote ? "text-color-accent" : "")
          }
        >
          <span>{note.smartNote ? "Your generated TODOs" : title}</span>
        </div>
        <div className="flex-1 text-right font-mono text-xs">{localDate}</div>
      </div>
      <div className="border-b border-color-text-primary"></div>
      <div className="text-sm line-clamp-3">{note.text}</div>
      {note.isNew && (
        <div className="w-4 ml-auto">
          <UnsyncedIcon iconProps={{ strokeWidth: "2" }} />
        </div>
      )}
    </div>
  )
}
