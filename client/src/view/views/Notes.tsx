import { useStore } from "../../model/store"

export function ViewNotes() {
  const notes = useStore((state) => state.notes)

  return (
    <div className="flex flex-col gap-4 w-full">
      {notes.map((note, i) => (
        <div key={i}>{note}</div>
      ))}
    </div>
  )
}
