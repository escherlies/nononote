import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"

export function ViewNotes() {
  const notes = useStore((state) => state.notes)

  return (
    <div className="flex flex-col gap-10 w-full">
      {notes.map((note) => (
        <div
          key={note.id}
          className="line-clamp-2 font-bold cursor-pointer select-none"
          onClick={() => navigateTo(tag("Note", { id: note.id }))}
        >
          {note.text}
        </div>
      ))}
    </div>
  )
}
