import { closeMenu, seachNotes, setView, useStore } from "./store"
import Navigo from "navigo"

import { T } from "../../../shared/types"

const router = new Navigo("/")

// Initial route
router.resolve(window.location.pathname)

//
//
// ~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~ //

export type View =
  | T<"Home">
  | T<"Notes">
  | T<"Note", { id: string }>
  | T<"EditNote", { id: string }>
  | T<"Settings">
  | T<"Search", { query: string }>
  | T<"NotFound">

// ~~~~~~~~~~~~~~~~ Routes ~~~~~~~~~~~~~~~ //

// Home
router.on("/", () => setView({ tag: "Home" }))

// Notes
router.on("/notes", () => setView({ tag: "Notes" }))

// Note
router.on(
  "/notes/:id",
  (match) => match && setView({ tag: "Note", id: match.data!.id })
)

// Edit note
router.on(
  "/notes/:id/edit",
  (match) => match && setView({ tag: "EditNote", id: match.data!.id })
)

// Settings
router.on("/settings", () => setView({ tag: "Settings" }))

// Search
router.on(
  "/notes",
  (match) => match && setView({ tag: "Search", query: match.params!.q }),
  {
    after: (match) => {
      seachNotes(match.params?.q || "")
    },
  }
)

// Not found
router.notFound(() => setView({ tag: "NotFound" }))

// ~~~~~~~~~~~~~~ Navigation ~~~~~~~~~~~~~ //

export const navigateTo = (view: View) => {
  closeMenu()

  switch (view.tag) {
    case "Home":
      return router.navigate("/")

    case "Notes":
      return router.navigate("/notes")

    case "Note":
      return router.navigate(`/notes/${view.id}`)

    case "Settings":
      return router.navigate("/settings")

    case "Search":
      return router.navigate("/notes?q=" + view.query)

    case "NotFound":
      return router.navigate("/404")
  }
}
