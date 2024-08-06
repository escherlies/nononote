import welcome from "url:../../assets/notes/Welcome.md"
import shortcuts from "url:../../assets/notes/Shortcuts.md"
import { Note } from "../../../server/src/data/note"
import { useStore } from "./store"

export async function loadIntroNotes() {
  // Welcome note
  const response = await fetch(welcome)
  const text = await response.text()
  const welcomeNote: Note = {
    id: "welcome",
    text: text,
    tags: ["welcome"],
    categories: ["nononote"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Shortcuts note
  const response2 = await fetch(shortcuts)
  const text2 = await response2.text()
  const shortcutsNote: Note = {
    id: "shortcuts",
    text: text2,
    tags: ["shortcuts"],
    categories: ["nononote"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Add notes to store
  const notes = [welcomeNote, shortcutsNote]

  useStore.setState((state) => {
    return { ...state, notes: [...state.notes, ...notes] }
  })
}
