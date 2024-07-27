import { Route, Routes } from "react-router-dom"
import { saveNote, setNoteInput, useStore } from "../../model/store"
import { MainButton, TextButton } from "../Ui"
import React from "react"

export function Menu() {
  const noteInput = useStore((state) => state.noteInput)

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Container>
            {noteInput === "" ? (
              <MainButton navigateTo="/notes" />
            ) : (
              <TextButton onClick={saveNote}>Save</TextButton>
            )}
          </Container>
        }
      />
      <Route
        path="/notes"
        element={
          <Container>
            <MainButton navigateTo="/" />
            <TextButton>Menu</TextButton>
          </Container>
        }
      />
    </Routes>
  )
}

interface ContainerProps {
  children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="flex gap-4 w-full justify-center items-center">
      {children}
    </div>
  )
}
