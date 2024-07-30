// Keyboard bindings

import { navigateTo } from "./router"
import { saveNote } from "./store"

export function initBindings() {
  window.addEventListener("keydown", handleKeyDown, false)
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.metaKey) {
    // Check for the 'cmd' key
    switch (event.key.toLowerCase()) {
      case "s":
        event.preventDefault()
        saveNote()
        break
      case "f":
      case "k":
        event.preventDefault()
        navigateTo({ tag: "Search", query: "" })
        break
      case "enter":
        event.preventDefault()
        navigateTo({ tag: "Home" })
        break
      default:
        break
    }
  }
}
