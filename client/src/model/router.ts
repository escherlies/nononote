import UniversalRouter, { Routes } from "universal-router"
import { setView } from "./store"

export type View = "Home" | "Notes" | { tag: "Note"; id: string } | "NotFound"

const routes: Routes = [
  { path: "/", action: () => setView("Home") },
  { path: "/notes", action: () => setView("Notes") },
  {
    path: "/note/:id",
    action: (context) =>
      setView({ tag: "Note", id: context.params.id as string }),
  },
]

const router = new UniversalRouter(routes)

export const navigateTo = router.resolve
