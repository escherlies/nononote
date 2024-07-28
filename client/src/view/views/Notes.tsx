import { Link } from "react-router-dom"
import { useStore } from "../../model/store"

export function ViewNotes() {
  const notes = useStore((state) => state.notes)

  return (
    <div className="flex flex-col gap-10 w-full p-10">
      {notes.map((note, i) => (
        <Link to={`/notes/${i}`}>
          <div key={i} className="line-clamp-2 font-bold">
            {note}
          </div>
        </Link>
      ))}
    </div>
  )
}
