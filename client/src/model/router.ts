import UniversalRouter, { Routes } from "universal-router"
import { setView } from "./store"
import Navigo from "navigo"

export type View = "Home" | "Notes" | { tag: "Note"; id: string } | "NotFound"

const router = new Navigo("/")

router.on("/", () => setView("Home"))
router.on("/notes", () => setView("Notes"))
router.on(
  "/note/:id",
  (match) => match && setView({ tag: "Note", id: match.data!.id })
)

export const navigateTo = async (pathname: string) => {
  router.navigate(pathname)
}

// Initial route
router.resolve(window.location.pathname)
