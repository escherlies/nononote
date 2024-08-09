import { useState } from "react"
import { useStore } from "../../../model/store"
import { GetShitDoneIcon } from "../../components/Icons"
import { SmartActionButton, Title } from "../../Ui"
import Markdown from "../../components/Markdown"

type Props = { noteId: string }

export const ViewFocusFrenzy = ({ noteId }: Props) => {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)

  const notes = [...storedNotes, ...unsyncedNewNotes]

  const [todo, setTodo] = useState(null as null | string)

  const note = notes.find((note) => note.id === noteId)

  const getRandomTodo = (todos_: string[]) => {
    const todo = getRandomElement(todos_)
    setTodo(todo || null)
  }

  if (!note) {
    return (
      <div className="flex h-full w-full">
        <div className="m-auto">Note not found</div>
      </div>
    )
  }

  const todos = extractMarkdownCheckboxes(note.text)

  return (
    <div className="flex flex-col gap-5">
      <Title>Focus Frenzy</Title>

      <p>Go set yourself a timer. We recommentd an hour.</p>
      <SmartActionButton
        onClick={() => getRandomTodo(todos)}
        text="Ok lets get shit done!"
        icon={<GetShitDoneIcon />}
      />

      {todo && (
        <div className="p-5 bg-background-secondary rounded-xl">
          <Markdown className="text-2xl" content={todo}></Markdown>
        </div>
      )}
    </div>
  )
}

function extractMarkdownCheckboxes(markdownText: string): string[] {
  // Regular expression to match markdown checkboxes
  const checkboxRegex = /- \[( |x)\]\s.*$/gm

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
