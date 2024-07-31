// Keyboard bindings

import { navigateTo } from "./router"
import { saveNote, useStore } from "./store"

export function initBindings() {
  window.addEventListener("keydown", handleKeyDown, false)
}

function handleKeyDown(event: KeyboardEvent) {
  const view = useStore.getState().view

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
        {
          event.preventDefault()
          if (view.tag === "Home") {
            saveNote()
          } else {
            navigateTo({ tag: "Home" })
          }
        }
        break

      default:
        break
    }
  }

  if (event.ctrlKey) {
    switch (event.key.toLowerCase()) {
      case "enter":
        {
          event.preventDefault()
          if (view.tag === "Home") {
            saveNote()
          } else {
            navigateTo({ tag: "Home" })
          }
        }
        break

      default:
        break
    }
  }

  switch (event.key.toLowerCase()) {
    case "escape": {
      switch (view.tag) {
        case "Home":
          return navigateTo({ tag: "Notes" })

        case "Search":
          return navigateTo({ tag: "Notes" })

        default:
          return navigateTo({ tag: "Home" })
      }
    }

    default:
      break
  }
}
