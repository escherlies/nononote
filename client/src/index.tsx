import { createRoot } from "react-dom/client"

import "./model/router"
import "./model/sounds"
import { loadIntroNotes } from "./model/intro"

import { initBindings } from "./model/keyboard"

import { App } from "./view/App"
import { loadUnsyncedNewNotes, toggleDarkMode, useStore } from "./model/store"
import { initAuth } from "./model/api"

// Mount react app
const container = document.getElementById("app")
if (container) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  throw new Error("No container found")
}

// Load intro notes
loadIntroNotes()

// Load unsynced new notes
loadUnsyncedNewNotes()

// Initialize keyboard bindings
initBindings()

// Add dark mode media event listener
const darkModeMedia = window.matchMedia("(prefers-color-scheme: dark)")
darkModeMedia.addEventListener("change", (e) => {
  toggleDarkMode(e.matches)
})
toggleDarkMode(darkModeMedia.matches)

// Init auth
initAuth()
