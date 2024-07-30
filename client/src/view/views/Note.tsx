import { map } from "rambda"
import { useStore } from "../../model/store"
import { navigateTo } from "../../model/router"

export function ViewNote({ noteId }: { noteId: string }) {
  const notes = useStore((state) => state.notes)
  const note = notes.find((note) => note.id === noteId)

  if (!note) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto">Note not found</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="m-auto">{note.text}</div>
      <div className="m-auto flex gap-4">
        {map(
          (tag) => (
            <div
              key={tag}
              className="text-sm bg-color-primary text-background-primary px-0.5"
              onClick={() => navigateTo({ tag: "Search", query: tag })}
            >
              {tag}
            </div>
          ),
          note.tags
        )}
      </div>
    </div>
  )
}
