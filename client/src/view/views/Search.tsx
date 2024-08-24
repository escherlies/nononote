// import fuzzysort from "fuzzysort"
import MiniSearch from "minisearch"

import { tag } from "../../../../shared/types"
import { navigateTo } from "../../model/router"
import { useStore } from "../../model/store"
import { find } from "rambda"

const miniSearch = new MiniSearch({
  fields: ["tags", "text", "categories"],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
  },
})

export const ViewNotesSearch = () => {
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

        const matches = Object.keys(result.match)

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
              <HighlightTags
                tags={note.tags.filter((tag) => matches.includes(tag.toLowerCase()))}
              />
              <HighlightTags
                tags={note.categories.filter((tag) => matches.includes(tag.toLowerCase()))}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const HighlightedText = ({ text, match }: { text: string; match: string[] }) => {
  const parts = text.split(new RegExp(`(${match.join("|")})`, "gi"))

  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={
            match.includes(part.toLowerCase()) ? "bg-color-accent text-background-primary" : ""
          }
        >
          {part}
        </span>
      ))}
    </span>
  )
}

const HighlightTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="text-xs bg-color-accent px-0.5 text-white uppercase dark:text-background-primary cursor-pointer"
        >
          {tag}
        </div>
      ))}
    </div>
  )
}
