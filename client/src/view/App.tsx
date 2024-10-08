import { ViewHome } from "./views/Home"
import { ViewNotes } from "./views/Notes"
import { BodyContainer, Layout } from "./components/Layout"
import { Menu } from "./views/Menu"
import { setError, useStore } from "../model/store"
import { ViewNote } from "./views/Note"
import { ViewNotesSearch } from "./views/Search"
import { ViewInfo } from "./views/Info"
import { ColorStyleTag } from "./views/settings/Color"
import { ViewSettings } from "./views/Settings"
import { ViewEditNote } from "./views/Edit"
import { Auth } from "./views/Auth"
import { ReactNode } from "react"
import { ViewModal } from "./Modal"
import { ViewSmartActions } from "./views/SmartActions"
import { ViewTodoGame } from "./views/TodoGame"
import { ViewGames } from "./views/Games"
import { useWindowSize } from "@react-hook/window-size"
import Confetti from "react-confetti"
import { Toaster } from "react-hot-toast"

export const App = () => {
  const authToken = useStore((state) => state.authToken)

  if (!authToken) {
    return (
      <Container>
        <Auth />
      </Container>
    )
  }

  return (
    <Container>
      <Layout body={<ViewBody />} footer={<Menu />} />
    </Container>
  )
}

const Container = ({ children }: { children: ReactNode }) => {
  const [width, height] = useWindowSize()
  const error = useStore((state) => state.error)
  const confetti = useStore((state) => state.confetti)

  return (
    <div className="w-dvw h-svh bg-background-primary flex text-color-text-primary">
      <div className="h-svh w-full flex safe-area">
        <div className="flex flex-col m-auto max-w-sm h-full max-h-[800px] gap-2 w-full p-4">
          {children}
        </div>
      </div>
      {/* Modal overlay */}
      <ViewModal />

      {/* Error overlay */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-2 flex gap-4 items-center">
          <div>{error}</div>
          <button className="ml-auto text-xs cursor-pointer" onClick={() => setError(null)}>
            CLOSE
          </button>
        </div>
      )}

      {/* Confetti */}
      {confetti !== "no" && (
        <Confetti
          numberOfPieces={confetti == "yes" ? 150 : 0}
          className="fixed inset-0 overflow-hidden"
          width={width - 1}
          height={height - 1}
        />
      )}

      {/* Toasts */}
      <Toaster
        toastOptions={{
          style: {
            background: "var(--color-accent)",
            color: "var(--background-primary)",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem",
          },
        }}
      />

      {/* Style */}
      <ColorStyleTag />
    </div>
  )
}

const ViewBody = () => {
  const view = useStore((state) => state.view)

  // Views that don't need a container
  switch (view.tag) {
    case "Home":
      return <ViewHome />

    case "Notes":
      return (
        <div className="flex flex-col gap-5">
          <ViewSmartActions />
          <ViewNotes />
        </div>
      )

    case "Note":
      return <ViewNote noteId={view.id} />

    case "PlayTodoGame":
      return <ViewTodoGame noteId={view.noteId} />

    case "PlayTodoGameGame":
      return <ViewGames gameId={view.gameId} noteId={view.noteId} />

    case "EditNote":
      return <ViewEditNote />

    case "Settings":
      return <ViewSettings />

    default:
      break
  }

  // Wrap normal views in a container
  const elem = (() => {
    switch (view.tag) {
      case "NotFound":
        return <div>Not Found</div>

      case "Search":
        return <ViewNotesSearch />

      case "Info":
        return <ViewInfo />
    }
  })()

  return <BodyContainer>{elem}</BodyContainer>
}
