import { MainButton, TextButton } from "./Ui"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { ViewHome } from "./views/Home"
import { ReactNode } from "react"
import { ViewNotes } from "./views/Notes"
import { Layout } from "./components/Layout"
import { Menu } from "./views/Menu"

export function App() {
  return (
    <BrowserRouter>
      <div className="w-dvw h-dvh bg-secondary-100 flex text-primary">
        <Layout
          body={
            <Routes>
              <Route path="/" element={<ViewHome />} />
              <Route path="/notes" element={<ViewNotes />} />
            </Routes>
          }
          footer={<Menu></Menu>}
        />
      </div>
    </BrowserRouter>
  )
}
