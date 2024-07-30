import { useStore } from "../../model/store"

export function ViewNote({ noteId }: { noteId: string }) {
  const notes = useStore((state) => state.notes)
  const note = notes.find((note, ix) => String(ix) === noteId)

  if (!note) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto">Note not found</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      <div className="m-auto">{note}</div>
    </div>
  )
}
