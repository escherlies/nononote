import { createRoot } from "react-dom/client"

import "./model/router"
import { initBindings } from "./model/keyboard"

import { App } from "./view/App"
import { loadUnsyncedNewNotes, startSubscription, useStore } from "./model/store"

// Mount react app
const container = document.getElementById("app")
if (container) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  throw new Error("No container found")
}

// Load unsynced new notes
loadUnsyncedNewNotes()

// Initialize keyboard bindings
initBindings()

// Add dark mode media event listener
const darkModeMedia = window.matchMedia("(prefers-color-scheme: dark)")
darkModeMedia.addEventListener("change", (e) => {
  useStore.setState({ darkMode: e.matches })
})
useStore.setState({ darkMode: darkModeMedia.matches })

startSubscription()
