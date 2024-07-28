import { Route, Routes } from "react-router-dom"
import { saveNote, toggleMenu, useStore } from "../../model/store"
import { MainButton, TextButton } from "../Ui"
import React from "react"

export function Menu() {
  const noteInput = useStore((state) => state.noteInput)
  const menuOpen = useStore((state) => state.menuOpen)

  return menuOpen ? (
    <div className="">
      <Container>
        <div onClick={toggleMenu}>
          <MainButton navigateTo="/" />
        </div>
        <TextButton className="w-[260px]" onClick={toggleMenu}>
          Close
        </TextButton>
      </Container>
    </div>
  ) : (
    <Routes>
      <Route
        path="/notes"
        element={
          <Container>
            <MainButton navigateTo="/" />
            <TextButton className="w-[260px]" onClick={toggleMenu}>
              Menu
            </TextButton>
          </Container>
        }
      />
      <Route
        path="/"
        element={
          <Container>
            {noteInput === "" ? (
              <MainButton navigateTo="/notes" />
            ) : (
              <TextButton className="w-[260px]" onClick={saveNote}>
                Save
              </TextButton>
            )}
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
