import { useStore } from "../../model/store"

export function ViewNote({ noteId }: { noteId: string }) {
  const notes = useStore((state) => state.notes)
  const note = notes.find((note, ix) => String(ix) === noteId)

  if (!note) {
    return <div>Note not found</div>
  }

  return <div>{note}</div>
}
