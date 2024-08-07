import { head, map, pipe, prop, reverse, sortBy, tail } from "rambda"
import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"
import { Note } from "../../../../server/src/data/note"
import { UnsyncedIcon } from "../components/Icons"

const setIsCached = (isNew: boolean) => (note: Note) => {
  return {
    ...note,
    isNew,
  }
}

export function ViewNotes() {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)

  const allNotes = [
    ...map(setIsCached(false), storedNotes),
    ...map(setIsCached(true), unsyncedNewNotes),
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
        const rest = tail(lines).join(" · ")

        return (
          <div
            key={note.id}
            className="cursor-pointer select-none"
            onClick={() => navigateTo(tag("Note", { id: note.id }))}
          >
            <div className="line-clamp-2">
              <span className="font-bold">{firstLine}</span>
              {rest && " · "}
              {rest}
            </div>
            {note.isNew && (
              <div className="w-4" title="Unsynced">
                <UnsyncedIcon />
              </div>
            )}
          </div>
        )
      }, notes)}
    </div>
  )
}
