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
      <div className="w-dvw h-dvh bg-background-primary flex text-color-primary">
        <Layout
          body={
            <Routes>
              <Route path="/notes" element={<ViewNotes />} />
              <Route path="/*" element={<ViewHome />} />
            </Routes>
          }
          footer={<Menu />}
        />
      </div>
    </BrowserRouter>
  )
}
