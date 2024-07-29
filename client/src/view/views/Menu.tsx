import { navigateTo } from "../../model/router"
import { saveNote, toggleMenu, useStore } from "../../model/store"
import { MainButton, TextButton } from "../Ui"
import React from "react"

export function Menu() {
  const menuOpen = useStore((state) => state.menuOpen)

  return (
    <div className="relative">
      {menuOpen && (
        <Container className="absolute top-0 left-0 transform -translate-y-full flex flex-col pb-4">
          <TextButton className="w-full">Settings</TextButton>
          <TextButton className="w-full">Search</TextButton>
        </Container>
      )}
      <Container>
        <MainButton onClick={toggleMenu} />
        <ViewMainAction />
      </Container>
    </div>
  )
}

function ViewMainAction() {
  const noteInput = useStore((state) => state.noteInput)
  const view = useStore((state) => state.view)

  switch (view.tag) {
    case "Home":
      return noteInput === "" ? (
        <TextButton className="w-full" onClick={() => navigateTo("/notes")}>
          Notes
        </TextButton>
      ) : (
        <TextButton className="w-full" onClick={saveNote}>
          Save
        </TextButton>
      )

    case "Notes":
      return (
        <TextButton className="w-full" onClick={() => navigateTo("/")}>
          New
        </TextButton>
      )

    case "Note":
      return (
        <TextButton
          className="w-full"
          onClick={() => navigateTo(`/notes/${view.id}/edit`)}
        >
          Edit
        </TextButton>
      )

    case "NotFound":
      return (
        <TextButton className="w-full" onClick={() => navigateTo("/")}>
          X_X
        </TextButton>
      )
  }

  return <div>Not found</div>
}

export interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export function Container(props: ContainerProps) {
  return (
    <div
      className={
        "flex gap-4 w-full justify-center items-center " + props.className
      }
    >
      {props.children}
    </div>
  )
}
