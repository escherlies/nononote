import { map, prop, sortBy } from "rambda"
import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"
import { Note } from "../../../../server/src/data"

const setIsCached = (isNew: boolean) => (note: Note) => {
  return {
    ...note,
    isNew,
  }
}

export function ViewNotes() {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)

  const notes = sortBy(prop("createdAt"), [
    ...map(setIsCached(false), storedNotes),
    ...map(setIsCached(true), unsyncedNewNotes),
  ])

  return (
    <div className="flex flex-col gap-10 w-full">
      {map(
        (note) => (
          <div
            key={note.id}
            className="cursor-pointer select-none"
            onClick={() => navigateTo(tag("Note", { id: note.id }))}
          >
            <div className="line-clamp-2 font-bold">{note.text}</div>
            {note.isNew && <div className="text-xs text-gray-500">Unsynced</div>}
          </div>
        ),
        notes
      )}
    </div>
  )
}
