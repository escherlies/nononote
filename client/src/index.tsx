import { createRoot } from "react-dom/client"
import { App } from "./view/App"
import { useStore } from "./model/store"

import { sampleNotes } from "./sample-data"

// Mount react app
const container = document.getElementById("app")
if (container) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  throw new Error("No container found")
}

// Set sample notes to store
useStore.setState({
  notes: sampleNotes,
})
