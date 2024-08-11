import { map } from "rambda"
import { goBack, navigateTo, View } from "../../model/router"
import { clearInput, clearSearchQuery, saveNote, setModal, useStore } from "../../model/store"
import {
  SaveNoteIcon,
  NotesIcon,
  Pencil,
  NewNoteIcon,
  SearchIcon,
  SettingsIcon,
  DismissIcon,
  GoBackIcon,
  DeleteIcon,
} from "../components/Icons"
import { SearchInput } from "../components/SearchInput"
import { IconButton } from "../Ui"
import { VoiceRecorder } from "../components/VoiceRecorder"
import { ViewFileUpload } from "../components/FileUpload"

export function Menu() {
  const theme = useStore((state) => state.settings.theme)
  const view = useStore((state) => state.view)
  const noteInput = useStore((state) => state.noteInput)
  const searchQuery = useStore((state) => state.searchQuery)

  const items = getItems({ view, noteInput, searchQuery })
  const uiButtons = map((item) => item.item, items)
  const descriptions = map((item) => item.description, items)

  switch (theme) {
    case "modern":
      return (
        <div className="relative w-full">
          <div className="flex gap-1 justify-between rounded-xl">
            {/* ?! Cant decide on a theme :) */}
            {/* <div className="flex gap-1 justify-between rounded-xl bg-background-secondary p-1"> */}
            {items.map((item) => item.item)}
          </div>
        </div>
      )
    case "space-craft":
      return (
        <div className="relative w-full">
          <div className="flex flex-col outline outline-[1.5px] outline-color-text-primary rounded-xl">
            <div className="flex gap-1 justify-between p-2">{uiButtons}</div>
            <div className="flex justify-between text-xs uppercase font-medium text-center bg-color-text-primary text-background-primary rounded-b-lg border-[1.5px] border-neutral-900 px-2">
              {descriptions.map((description) => (
                <Description key={description}>{description}</Description>
              ))}
            </div>
          </div>
        </div>
      )
    case "brutalist":
      return (
        <div className="relative w-full">
          <div className="flex gap-1 justify-between xbg-background-secondary rounded-xl p-1">
            {uiButtons}
          </div>
        </div>
      )
  }
}

const BackButton = ({ className }: { className?: string }) => {
  return (
    <IconButton ariaLabel="Back" onClick={goBack} icon={<GoBackIcon />} className={className} />
  )
}
function getItems({
  view,
  noteInput,
  searchQuery,
}: {
  view: View
  noteInput: string
  searchQuery: string
}): { item: JSX.Element; description: string }[] {
  switch (view.tag) {
    case "Home":
      if (noteInput !== "") {
        return [
          {
            item: (
              <IconButton
                key="abort"
                ariaLabel="Discard new note"
                onClick={clearInput}
                icon={<DismissIcon />}
              />
            ),
            description: "Abort",
          },
          {
            item: (
              <IconButton
                key="save"
                ariaLabel="Save new note"
                onClick={saveNote}
                icon={<SaveNoteIcon />}
              />
            ),

            description: "Save",
          },
        ]
      } else {
        return [
          {
            item: (
              <IconButton
                key="notes"
                ariaLabel="Notes"
                onClick={() => navigateTo({ tag: "Notes" })}
                icon={<NotesIcon />}
              />
            ),
            description: "Notes",
          },
          {
            item: (
              <IconButton
                key="search"
                ariaLabel="Search"
                onClick={() => navigateTo({ tag: "Search", query: "" })}
                icon={<SearchIcon />}
              />
            ),
            description: "Search",
          },
          {
            item: (
              <IconButton
                key="settings"
                ariaLabel="Navigate to settings"
                onClick={() => navigateTo({ tag: "Settings" })}
                icon={<SettingsIcon />}
              />
            ),
            description: "Settings",
          },
        ]
      }

    case "Search":
      return [
        {
          item: <BackButton key="back" />,
          description: "Back",
        },
        {
          item: <SearchInput key="search-input" />,
          description: "Search Input",
        },
        searchQuery === ""
          ? {
              item: (
                <IconButton
                  key="home"
                  ariaLabel="Navigate to home"
                  onClick={() => navigateTo({ tag: "Home" })}
                  icon={<NewNoteIcon />}
                />
              ),
              description: "New",
            }
          : {
              item: (
                <IconButton
                  key="clear"
                  ariaLabel="Clear search query"
                  onClick={clearSearchQuery}
                  icon={<DismissIcon />}
                />
              ),
              description: "Clear Search",
            },
      ]

    case "Note":
      return [
        {
          item: <BackButton key="back" />,
          description: "Back",
        },
        {
          item: (
            <IconButton
              key="edit"
              ariaLabel="Edit note"
              className={view.id.includes("intro-") ? "hidden" : undefined}
              onClick={() => navigateTo({ tag: "EditNote", id: view.id })}
              icon={<Pencil />}
            />
          ),
          description: "Edit",
        },
        {
          item: (
            <IconButton
              key="home"
              ariaLabel="Navigate to home"
              onClick={() => navigateTo({ tag: "Home" })}
              icon={<NewNoteIcon />}
            />
          ),
          description: "Home",
        },
      ]

    case "EditNote":
      return [
        {
          item: <BackButton key="back" />,
          description: "Back",
        },
        {
          item: (
            <IconButton
              key="delete"
              ariaLabel="Delete note"
              onClick={() => setModal({ tag: "DeleteNotePrompt", noteId: view.id })}
              icon={<DeleteIcon />}
            />
          ),
          description: "Back",
        },
        {
          item: (
            <IconButton
              key="save"
              ariaLabel="Save note"
              onClick={saveNote}
              icon={<SaveNoteIcon />}
              className={noteInput === "" ? "opacity-50" : ""}
            />
          ),
          description: "Save",
        },
      ]

    case "Notes":
      return [
        {
          item: <BackButton key="back" />,
          description: "Back",
        },
        {
          item: (
            <IconButton
              key="search"
              ariaLabel="Search"
              onClick={() => navigateTo({ tag: "Search", query: "" })}
              icon={<SearchIcon />}
            />
          ),
          description: "Search",
        },
        {
          item: (
            <IconButton
              key="home"
              ariaLabel="Navigate to home"
              onClick={() => navigateTo({ tag: "Home" })}
              icon={<NewNoteIcon />}
            />
          ),
          description: "Home",
        },
      ]

    default:
      return [
        {
          item: <BackButton key="back" />,
          description: "Back",
        },
        {
          item: (
            <IconButton
              key="home"
              ariaLabel="Navigate to home"
              onClick={() => navigateTo({ tag: "Home" })}
              icon={<NewNoteIcon />}
            />
          ),
          description: "Home",
        },
      ]
  }
}

const Description = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 group">
      <div className="min-w-[60px] w-fit text-center mx-auto group-first:mr-auto group-first:mx-0 group-last:mx-0 group-last:ml-auto">
        {children}
      </div>
    </div>
  )
}
