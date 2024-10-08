import { clearInput, closeMenu, initEditNote, setSeachQuery, setView } from "./store"
import Navigo from "navigo"

import { T } from "../../../shared/types"

const router = new Navigo("/")

export type Games = "focus-frenzy" | "todo-turnament"

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
  | T<"PlayTodoGame", { noteId: string }>
  | T<"PlayTodoGameGame", { noteId: string; gameId: Games }>

// ~~~~~~~~~~~~~~~~ Routes ~~~~~~~~~~~~~~~ //

// Home
router.on("/", () => setView({ tag: "Home" }))

// Notes
router.on("/notes", () => setView({ tag: "Notes" }))

// Search
router.on(
  "/notes/search",
  (match) => match && setView({ tag: "Search", query: match?.params?.q || "" }),
  {
    after: (match) => {
      const query = match?.params?.q || ""
      setSeachQuery(query)
    },
  }
)

// Note
router.on("/notes/:id", (match) => match && setView({ tag: "Note", id: match.data!.id }))

// Edit note
router.on("/notes/:id/edit", (match) => match && setView({ tag: "EditNote", id: match.data!.id }), {
  after: (match) => {
    initEditNote(match?.data!.id)
  },
  leave: (done) => {
    clearInput()
    done()
  },
})

// Play todo game
router.on(
  "/notes/:noteId/todo-game/:gameId",
  (match) =>
    match &&
    setView({
      tag: "PlayTodoGameGame",
      noteId: match.data!.noteId,
      gameId: match.data!.gameId as Games,
    })
)

// Play todo game
router.on(
  "/notes/:noteId/todo-game",
  (match) => match && setView({ tag: "PlayTodoGame", noteId: match.data!.noteId })
)

// Settings
router.on("/settings", () => setView({ tag: "Settings" }))

// Info
router.on("/info", () => setView({ tag: "Info" }))

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

    case "Search":
      return router.navigate(`/notes/search?q=${view.query}`)

    case "Note":
      return router.navigate(`/notes/${view.id}`)

    case "EditNote":
      return router.navigate(`/notes/${view.id}/edit`)

    case "PlayTodoGame":
      return router.navigate(`/notes/${view.noteId}/todo-game`)

    case "PlayTodoGameGame":
      return router.navigate(`/notes/${view.noteId}/todo-game/${view.gameId}`)

    case "Settings":
      return router.navigate("/settings")

    case "Info":
      return router.navigate("/info")
  }
}

export const goBack = () => {
  const currentPath = window.location.pathname
  const parentPath = currentPath.split("/").slice(0, -1).join("/")
  if (parentPath === "") return router.navigate("/")

  router.navigate(parentPath)
}

// ~~~~~~~~~~~~~~~~~ Init ~~~~~~~~~~~~~~~~ //

// Initial route
document.addEventListener("DOMContentLoaded", () => {
  router.resolve(window.location.pathname + window.location.search)
})

// ##################################################################### //
// ################################ Misc ############################### //
// ##################################################################### //

// Get view name

export const getViewName = (view: View): string => {
  switch (view.tag) {
    case "Home":
      return "New Note"

    case "Notes":
      return "Notes"

    case "Search":
      return "Search"

    case "Note":
      return "Note"

    case "EditNote":
      return "Edit Note"

    case "Settings":
      return "Settings"

    case "Info":
      return "Info"

    case "NotFound":
      return "Not Found"

    case "PlayTodoGame":
      return "Play Todo Game"

    case "PlayTodoGameGame":
      return view.gameId
  }
}
