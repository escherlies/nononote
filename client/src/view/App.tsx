import { ViewHome } from "./views/Home"
import { ViewNotes } from "./views/Notes"
import { Layout } from "./components/Layout"
import { Menu } from "./views/Menu"
import { useStore } from "../model/store"
import { ViewNote } from "./views/Note"
import { ViewNotesSearch } from "./views/Search"
import { ViewInfo } from "./views/Info"
import { ColorStyleTag } from "./views/settings/Color"
import { ViewSettings } from "./views/Settings"

export function App() {
  return (
    <div className="w-dvw h-dvh bg-background-primary flex text-color-primary">
      <Layout body={<ViewBody />} footer={<Menu />} />
      <ColorStyleTag />
    </div>
  )
}

function ViewBody() {
  const view = useStore((state) => state.view)

  switch (view.tag) {
    case "NotFound":
      return <div>Not Found</div>

    case "Home":
      return <ViewHome />

    case "Notes":
      return <ViewNotes />

    case "Note":
      return <ViewNote noteId={view.id} />

    case "EditNote":
      return <ViewNote noteId={view.id} />

    case "Search":
      return <ViewNotesSearch />

    case "Info":
      return <ViewInfo />

    case "Settings":
      return <ViewSettings />
  }
}
