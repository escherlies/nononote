import { navigateTo } from "../../model/router"
import { saveNote, useStore } from "../../model/store"
import { CheckIcon, NotesIcon, PlusIcon, QuestionMarkIcon, SearchIcon, SettingsIcon } from "../components/Icons"
import { SearchInput } from "../components/SearchInput"
import { MenuButton, IconButton } from "../Ui"

export function Menu() {
  return (
    <div className="relative w-full">
      <ViewMenuOpen />
      <div className="flex gap-5 justify-end">
        <ViewMainAction />
      </div>
    </div>
  )
}

function ViewMainAction() {
  const view = useStore((state) => state.view)
  const noteInput = useStore((state) => state.noteInput)

  if (noteInput !== "") {
    return <IconButton onClick={saveNote} icon={<CheckIcon />} />
  }

  switch (view.tag) {
    case "Home":
      return [
        //
        <MenuButton key="menu" />,
        <IconButton key="search" onClick={() => navigateTo({ tag: "Search", query: "" })} icon={<SearchIcon />} />,
        <IconButton key="notes" onClick={() => navigateTo({ tag: "Notes" })} icon={<NotesIcon />} />,
      ]

    case "Search":
      return [
        //
        <SearchInput key="search-input" />,
        <IconButton
          key="notes"
          onClick={() => navigateTo({ tag: "Notes" })}
          icon={
            <div className="rotate-45">
              <PlusIcon />
            </div>
          }
        />,
      ]

    default:
      return [
        <MenuButton key="menu" />,
        <IconButton key="search" onClick={() => navigateTo({ tag: "Search", query: "" })} icon={<SearchIcon />} />,
        <IconButton key="home" onClick={() => navigateTo({ tag: "Home" })} icon={<PlusIcon />} />,
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
          <IconButton onClick={() => navigateTo({ tag: "Info" })} icon={<QuestionMarkIcon />} />
        </div>
      </div>
    )
  )
}
