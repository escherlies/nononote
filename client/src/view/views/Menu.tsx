import { saveNote, toggleMenu, useStore } from "../../model/store"
import { MainButton, TextButton } from "../Ui"
import React from "react"

export function Menu() {
  const menuOpen = useStore((state) => state.menuOpen)

  return menuOpen ? <ViewOpenMenu /> : <ViewClosedMenu />
}

function ViewOpenMenu() {
  return (
    <div className="relative">
      <Container className="absolute top-0 left-0 transform -translate-y-full flex flex-col pb-4">
        <TextButton className="w-full">Settings</TextButton>
        <TextButton className="w-full">Search</TextButton>
      </Container>
      <Container>
        <MainButton navigateTo="/" />
        <TextButton className="w-full" onClick={toggleMenu}>
          Close
        </TextButton>
      </Container>
    </div>
  )
}

function ViewClosedMenu() {
  const noteInput = useStore((state) => state.noteInput)
  const view = useStore((state) => state.view)

  switch (view.tag) {
    case "Home":
      return (
        <Container>
          {noteInput === "" ? (
            <MainButton navigateTo="/notes" />
          ) : (
            <TextButton className="w-full" onClick={saveNote}>
              Save
            </TextButton>
          )}
        </Container>
      )

    case "Notes":
      return (
        <Container>
          <MainButton navigateTo="/" />
          <TextButton className="w-full" onClick={toggleMenu}>
            Menu
          </TextButton>
        </Container>
      )

    case "Note":
      return (
        <Container>
          <MainButton navigateTo="/notes" />
          <TextButton className="w-full" onClick={toggleMenu}>
            Menu
          </TextButton>
        </Container>
      )

    case "NotFound":
      return (
        <Container>
          <MainButton navigateTo="/" />
          <TextButton className="w-full" onClick={toggleMenu}>
            Menu
          </TextButton>
        </Container>
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
