import { ViewHome } from "./views/Home"
import { ViewNotes } from "./views/Notes"
import { Layout } from "./components/Layout"
import { Menu } from "./views/Menu"
import { useStore } from "../model/store"
import { ViewNote } from "./views/Note"

export function App() {
  return (
    <div className="w-dvw h-dvh bg-background-primary flex text-color-primary">
      <Layout body={<ViewBody />} footer={<Menu />} />
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
      return <div>Search</div>

    case "Settings":
      return <div>Settings</div>
  }
}
