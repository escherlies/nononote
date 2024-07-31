import { closeMenu, setSeachQuery, setView } from "./store"
import Navigo from "navigo"

import { T } from "../../../shared/types"

const router = new Navigo("/")

//
//
// ~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~ //

export type View =
  | T<"Home">
  | T<"Notes">
  | T<"Note", { id: string }>
  | T<"EditNote", { id: string }>
  | T<"Settings">
  | T<"Info">
  | T<"Search", { query: string }>
  | T<"NotFound">

// ~~~~~~~~~~~~~~~~ Routes ~~~~~~~~~~~~~~~ //

// Home
router.on("/", () => setView({ tag: "Home" }))

// Notes
router.on("/notes", () => setView({ tag: "Notes" }))

// Note
router.on("/notes/:id", (match) => match && setView({ tag: "Note", id: match.data!.id }))

// Edit note
router.on("/notes/:id/edit", (match) => match && setView({ tag: "EditNote", id: match.data!.id }))

// Settings
router.on("/settings", () => setView({ tag: "Settings" }))

// Info
router.on("/info", () => setView({ tag: "Info" }))

// Search
router.on("/search", (match) => match && setView({ tag: "Search", query: match?.params?.q || "" }), {
  after: (match) => {
    const query = match?.params?.q || ""
    setSeachQuery(query)
  },
})

// Not found
router.notFound(() => setView({ tag: "NotFound" }))

// ~~~~~~~~~~~~~~ Navigation ~~~~~~~~~~~~~ //

export const navigateTo = (view: View) => {
  closeMenu()

  switch (view.tag) {
    case "NotFound":
      return router.navigate("/404")

    case "Home":
      return router.navigate("/")

    case "Notes":
      return router.navigate("/notes")

    case "Note":
      return router.navigate(`/notes/${view.id}`)

    case "Settings":
      return router.navigate("/settings")

    case "Info":
      return router.navigate("/info")

    case "Search":
      return router.navigate(`/search?q=${view.query}`)

    case "EditNote":
      return router.navigate(`/notes/${view.id}/edit`)
  }
}

// ~~~~~~~~~~~~~~~~~ Init ~~~~~~~~~~~~~~~~ //

// Initial route
router.resolve(window.location.pathname + window.location.search)
