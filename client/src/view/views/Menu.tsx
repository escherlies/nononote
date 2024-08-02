import { navigateTo } from "../../model/router"
import { clearSearchQuery, saveNote, useStore } from "../../model/store"
import {
  SaveNoteIcon,
  NotesIcon,
  Pencil,
  NewNoteIcon,
  InfoOrHelpIcon,
  SearchIcon,
  SettingsIcon,
  DismissIcon,
  GoBackIcon,
} from "../components/Icons"
import { SearchInput } from "../components/SearchInput"
import { MenuButton, IconButton } from "../Ui"

export function Menu() {
  return (
    <div className="relative w-full">
      <ViewMenuOpen />
      <div className="flex gap-5 justify-between bg-neutral-200/50 rounded-lg p-1">
        <ViewMainAction />
      </div>
    </div>
  )
}

const BackButton = () => {
  return <IconButton onClick={() => window.history.back()} icon={<GoBackIcon />} />
}

function ViewMainAction() {
  const view = useStore((state) => state.view)
  const noteInput = useStore((state) => state.noteInput)
  const searchQuery = useStore((state) => state.searchQuery)

  switch (view.tag) {
    case "Home":
      if (noteInput !== "") {
        return <IconButton onClick={saveNote} icon={<SaveNoteIcon />} />
      } else {
        return [
          //
          // <IconButton
          //   key="search"
          //   onClick={() => navigateTo({ tag: "Search", query: "" })}
          //   icon={<SearchIcon />}
          // />,
          <IconButton
            key="notes"
            onClick={() => navigateTo({ tag: "Notes" })}
            icon={<NotesIcon />}
          />,
          <MenuButton key="menu" />,
        ]
      }

    case "Search":
      return [
        //
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
        // <MenuButton key="menu" />,
        <IconButton
          key="notes"
          onClick={() => navigateTo({ tag: "Notes" })}
          icon={<NotesIcon />}
        />,
        <IconButton
          key="edit"
          onClick={() => navigateTo({ tag: "EditNote", id: view.id })}
          icon={<Pencil />}
        />,
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

    case "EditNote":
      return [
        <BackButton key="back" />,
        // <MenuButton key="menu" />,
        <IconButton
          key="notes"
          onClick={() => navigateTo({ tag: "Notes" })}
          icon={<NotesIcon />}
        />,
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
        // <MenuButton key="menu" />,
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

const ViewMenuOpen = () => {
  const menuOpen = useStore((state) => state.menuOpen)

  return (
    menuOpen && (
      <div className="absolute right-0 top-0 transform -translate-y-full">
        <div className="grid grid-cols-3 gap-5 mb-5">
          <IconButton onClick={() => navigateTo({ tag: "Settings" })} icon={<SettingsIcon />} />
          <IconButton onClick={() => navigateTo({ tag: "Info" })} icon={<InfoOrHelpIcon />} />
        </div>
      </div>
    )
  )
}
