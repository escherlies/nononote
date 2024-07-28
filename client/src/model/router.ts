import { setView } from "./store"
import Navigo from "navigo"

import { T } from "../../../shared/types"

export type View =
  | T<"Home">
  | T<"Notes">
  | T<"Note", { id: string }>
  | T<"NotFound">

const router = new Navigo("/")

router.on("/", () => setView({ tag: "Home" }))
router.on(
  "/notes/:id",
  (match) => match && setView({ tag: "Note", id: match.data!.id })
)
router.on("/notes", () => setView({ tag: "Notes" }))

export const navigateTo = async (pathname: string) => {
  return router.navigate(pathname, { callHooks: true })
}

// Initial route
router.resolve(window.location.pathname)
