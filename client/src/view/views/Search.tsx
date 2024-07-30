// import fuzzysort from "fuzzysort"
import MiniSearch from "minisearch"

import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"

const miniSearch = new MiniSearch({
  fields: ["note"],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
})

export function ViewNotesSearch() {
  const allNotes = useStore((state) => state.notes)
  const query = useStore((state) => state.searchQuery)

  const notes = allNotes.map((note, idx) => ({ id: idx, note }))

  miniSearch.removeAll()
  miniSearch.addAll(notes)

  const results = miniSearch.search(query)

  if (query === "") {
    return (
      <div className="p-10 m-auto w-full h-full flex">
        <div className="text-2xl m-auto">
          <b>{allNotes.length}</b> Notes in total
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-10 m-auto w-full h-full flex">
        <div className="text-2xl m-auto">No results found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 w-full p-10">
      {results.map((result, index) => {
        // const index = allNotes?.findIndex((note) => note === result.target)

        return (
          <div key={index} className="">
            <div
              className="cursor-pointer select-none"
              onClick={() => navigateTo(tag("Note", { id: index.toString() }))}
            >
              <HighlightedText text={notes[result.id].note} match={result.terms} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HighlightedText({ text, match }: { text: string; match: string[] }) {
  const parts = text.split(new RegExp(`(${match.join("|")})`, "gi"))

  return (
    <span>
      {parts.map((part, index) => (
        <span key={index} className={match.includes(part) ? "bg-color-primary text-background-primary" : ""}>
          {part}
        </span>
      ))}
    </span>
  )
}
