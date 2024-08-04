// import fuzzysort from "fuzzysort"
import MiniSearch from "minisearch"

import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"
import { find } from "rambda"

const miniSearch = new MiniSearch({
  fields: ["text"],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
})

export function ViewNotesSearch() {
  const notes = useStore((state) => state.notes)
  const query = useStore((state) => state.searchQuery)

  miniSearch.removeAll()
  miniSearch.addAll(notes)

  const results = miniSearch.search(query)

  if (query === "") {
    return (
      <div className="m-auto w-full h-full flex">
        <div className="text-2xl m-auto">
          <b>{notes.length}</b> Notes in total
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="m-auto w-full h-full flex">
        <div className="text-2xl m-auto">No results found</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 w-full m-auto">
      {results.map((result, index) => {
        const note = find((note) => note.id === result.id, notes)

        if (!note) {
          return null
        }

        return (
          <div key={index} className="">
            <div
              className="cursor-pointer select-none"
              onClick={() => navigateTo(tag("Note", { id: note.id }))}
            >
              <HighlightedText text={note.text} match={result.terms} />
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
        <span
          key={index}
          className={match.includes(part) ? "bg-color-accent text-background-primary" : ""}
        >
          {part}
        </span>
      ))}
    </span>
  )
}
