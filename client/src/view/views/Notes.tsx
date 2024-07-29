import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"

export function ViewNotes() {
  const notes = useStore((state) => state.notes)

  return (
    <div className="flex flex-col gap-10 w-full p-10">
      {notes.map((note, idx) => (
        <div
          key={idx}
          className="line-clamp-2 font-bold cursor-pointer select-none"
          onClick={() => navigateTo(tag("Note", { id: idx.toString() }))}
        >
          {note}
        </div>
      ))}
    </div>
  )
}
