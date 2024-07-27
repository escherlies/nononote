import { MainButton, TextButton } from "./Ui"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import { ViewHome } from "./views/Home"

export function App() {
  return (
    <BrowserRouter>
      <div className="w-dvw h-dvh bg-secondary-100 flex text-primary">
        <div className="flex flex-col gap-4 m-auto">
          <Routes>
            <Route path="/" element={<ViewHome />} />
            <Route
              path="/notes"
              element={
                <div className="flex gap-4">
                  <MainButton navigateTo="/" />
                  <TextButton title="menu" />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
