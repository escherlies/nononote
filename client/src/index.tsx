import { createRoot } from "react-dom/client"
import { App } from "./view/App"

// Mount react app
const container = document.getElementById("app")
if (container) {
  const root = createRoot(container)
  root.render(<App />)
} else {
  throw new Error("No container found")
}
