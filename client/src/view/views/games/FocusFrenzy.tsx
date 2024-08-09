import { useEffect, useState } from "react"
import { useStore } from "../../../model/store"
import { GetShitDoneIcon } from "../../components/Icons"
import { SmartActionButton, Title } from "../../Ui"
import { MarkdownCheckbox } from "../../components/MarkdownInteractive"

import Confetti from "react-confetti"
import { useWindowSize } from "@react-hook/window-size"

type Props = { noteId: string }

export const ViewFocusFrenzy = ({ noteId }: Props) => {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)

  const [showConfetti, setConfetti] = useState("no" as "no" | "yes" | "stopEmitting")

  const [width, height] = useWindowSize()

  const notes = [...storedNotes, ...unsyncedNewNotes]

  const [todo, setTodo] = useState(null as null | string)

  const note = notes.find((note) => note.id === noteId)

  const getRandomTodo = (todos_: string[]) => {
    const todo = getRandomElement(todos_)
    setTodo(todo || null)
  }

  useEffect(() => {
    console.log("Notes changed")
    // Check whether the note has been checked
    if (todo && note) {
      const todoGotChecked = todo.replace("[ ]", "[x]")
      if (note.text.includes(todoGotChecked)) {
        //
        setConfetti("yes")
        setTodo(todoGotChecked)
        setTimeout(() => {
          setConfetti("stopEmitting")
          setTimeout(() => {
            setConfetti("no")
          }, 2000)
        }, 3000)
      }

      const todoGotUnChecked = todo.replace("[x]", "[ ]")
      if (note.text.includes(todoGotUnChecked)) {
        setTodo(todoGotUnChecked)
      }
    }
  }, [note?.text, todo])

  if (!note) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto">Note not found</div>
      </div>
    )
  }

  const todos = extractMarkdownCheckboxes(note.text)

  console.log(showConfetti)

  return (
    <div className="flex flex-col gap-5">
      <Title>Focus Frenzy</Title>

      <p>Go set yourself a timer. We recommentd an hour.</p>
      <SmartActionButton
        onClick={() => getRandomTodo(todos)}
        text="Let's go!"
        icon={<GetShitDoneIcon />}
      />

      {todo && (
        <div className="p-5 bg-background-secondary rounded-xl">
          <MarkdownCheckbox markdown={todo} noteId={noteId} />
        </div>
      )}
      {showConfetti !== "no" && (
        <Confetti
          numberOfPieces={showConfetti == "yes" ? 200 : 0}
          className="fixed inset-0 overflow-hidden"
          width={width - 1}
          height={height - 1}
        />
      )}
    </div>
  )
}

function extractMarkdownCheckboxes(markdownText: string): string[] {
  // Regular expression to match markdown checkboxes
  const checkboxRegex = /- \[ \]\s.*$/gm

  // Match all checkboxes in the markdown text
  const matches = markdownText.match(checkboxRegex)

  // If there are matches, return them, otherwise return an empty array
  return matches ? matches : []
}

function getRandomElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined // Handle empty array case
  }
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}
