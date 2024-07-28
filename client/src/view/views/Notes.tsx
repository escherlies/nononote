import { useStore } from "../../model/store"

export function ViewNotes() {
  const notes = useStore((state) => state.notes)

  return (
    <div className="flex flex-col gap-10 w-full p-10">
      {notes.map((note, i) => (
        <a key={i} href={`/notes/${i}`}>
          <div key={i} className="line-clamp-2 font-bold">
            {note}
          </div>
        </a>
      ))}
    </div>
  )
}
