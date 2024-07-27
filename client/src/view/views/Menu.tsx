import { Route, Routes } from "react-router-dom"
import { setNoteInput, useStore } from "../../model/store"
import { MainButton, TextButton } from "../Ui"

export function Menu() {
  const noteInput = useStore((state) => state.noteInput)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex gap-4 w-full">
            {noteInput === "" ? (
              <MainButton navigateTo="/notes" />
            ) : (
              <TextButton onClick={() => setNoteInput("")}>Save</TextButton>
            )}
          </div>
        }
      />
      <Route
        path="/notes"
        element={
          <div className="flex gap-4 w-full">
            <MainButton navigateTo="/" />
            <TextButton>Menu</TextButton>
          </div>
        }
      />
    </Routes>
  )
}
