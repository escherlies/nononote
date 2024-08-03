import { goBack, navigateTo } from "../../model/router"
import { clearSearchQuery, saveNote, useStore } from "../../model/store"
import {
  SaveNoteIcon,
  NotesIcon,
  Pencil,
  NewNoteIcon,
  SearchIcon,
  SettingsIcon,
  DismissIcon,
  GoBackIcon,
} from "../components/Icons"
import { SearchInput } from "../components/SearchInput"
import { IconButton } from "../Ui"

export function Menu() {
  const theme = useStore((state) => state.settings.theme)

  switch (theme) {
    case "future":
      return (
        <div className="relative w-full">
          <div className="flex gap-5 justify-between rounded-lg">
            {/* ?! Cant decide on a theme :) */}
            {/* <div className="flex gap-5 justify-between rounded-lg bg-background-secondary p-1"> */}
            <ViewMainAction />
          </div>
        </div>
      )
    case "space-craft":
      return (
        <div className="relative w-full">
          <div className="flex gap-5 justify-between bg-background-secondary rounded-lg p-1">
            <ViewMainAction />
          </div>
        </div>
      )
    case "brutalist":
      return (
        <div className="relative w-full">
          <div className="flex gap-5 justify-between bg-background-secondary rounded-lg p-1">
            <ViewMainAction />
          </div>
        </div>
      )
  }
}

const BackButton = ({ className }: { className?: string }) => {
  return <IconButton onClick={goBack} icon={<GoBackIcon />} className={className} />
}

function ViewMainAction() {
  const view = useStore((state) => state.view)
  const noteInput = useStore((state) => state.noteInput)
  const searchQuery = useStore((state) => state.searchQuery)

  switch (view.tag) {
    case "Home":
      if (noteInput !== "") {
        return <IconButton className="m-auto" onClick={saveNote} icon={<SaveNoteIcon />} />
      } else {
        return [
          // todo: fix this :D
          <IconButton
            onClick={() => ""}
            icon={<GoBackIcon />}
            className="opacity-50 pointer-events-none"
          />,
          <IconButton
            key="notes"
            onClick={() => navigateTo({ tag: "Notes" })}
            icon={<NotesIcon />}
          />,
          // <MenuButton key="menu" />,
          <IconButton
            key="settings"
            onClick={() => navigateTo({ tag: "Settings" })}
            icon={<SettingsIcon />}
          />,
        ]
      }

    case "Search":
      return [
        <BackButton key="back" />,
        <SearchInput key="search-input" />,
        searchQuery === "" ? (
          <IconButton
            key="home"
            onClick={() => navigateTo({ tag: "Home" })}
            icon={<NewNoteIcon />}
          />
        ) : (
          <IconButton key="notes" onClick={clearSearchQuery} icon={<DismissIcon />} />
        ),
      ]

    case "Note":
      return [
        <BackButton key="back" />,
        <IconButton
          key="edit"
          onClick={() => navigateTo({ tag: "EditNote", id: view.id })}
          icon={<Pencil />}
        />,
        <IconButton
          key="home"
          onClick={() => navigateTo({ tag: "Home" })}
          icon={<NewNoteIcon />}
        />,
      ]

    case "EditNote":
      return [
        <BackButton key="back" />,
        <IconButton
          key="save"
          onClick={saveNote}
          icon={<SaveNoteIcon />}
          className={noteInput === "" ? "opacity-50" : ""}
        />,
      ]

    case "Notes":
      return [
        <BackButton key="back" />,
        <IconButton
          key="search"
          onClick={() => navigateTo({ tag: "Search", query: "" })}
          icon={<SearchIcon />}
        />,
        <IconButton
          key="home"
          onClick={() => navigateTo({ tag: "Home" })}
          icon={<NewNoteIcon />}
        />,
      ]

    default:
      return [
        <BackButton key="back" />,
        <IconButton
          key="home"
          onClick={() => navigateTo({ tag: "Home" })}
          icon={<NewNoteIcon />}
        />,
      ]
  }
}
