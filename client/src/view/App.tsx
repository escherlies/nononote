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

export function App() {
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

type Props = {
  children: ReactNode
}
function Container({ children }: Props) {
  const error = useStore((state) => state.error)

  return (
    <div className="w-dvw h-dvh bg-background-primary flex text-color-text-primary">
      <div className="h-svh w-full p-4 flex sm:p-4">
        <div className="flex flex-col m-auto max-w-sm h-full max-h-[800px] gap-2 w-full">
          {children}
        </div>
      </div>
      {/* Modal overlay */}
      <ViewModal />

      {/* Error overlay */}
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-2 flex gap-4 items-center">
          <div>{error}</div>
          <div className="ml-auto text-xs cursor-pointer" onClick={() => setError(null)}>
            CLOSE
          </div>
        </div>
      )}
      <ColorStyleTag />
    </div>
  )
}

function ViewBody() {
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
  }

  // Wrap normal views in a container
  const elem = (() => {
    switch (view.tag) {
      case "NotFound":
        return <div>Not Found</div>

      case "EditNote":
        return <ViewEditNote />

      case "Search":
        return <ViewNotesSearch />

      case "Info":
        return <ViewInfo />

      case "Settings":
        return <ViewSettings />
    }
  })()

  return <BodyContainer>{elem}</BodyContainer>
}
