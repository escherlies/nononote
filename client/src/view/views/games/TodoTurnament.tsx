import { useEffect, useState } from "react"
import { showConfetti, useStore } from "../../../model/store"
import { GetShitDoneIcon } from "../../components/Icons"
import { SmartActionButton, Title } from "../../Ui"
import { MarkdownCheckbox } from "../../components/MarkdownInteractive"
import { drop, take } from "rambda"

type Props = { noteId: string }

export const ViewTodoTurnament = ({ noteId }: Props) => {
  const storedNotes = useStore((state) => state.notes)
  const unsyncedNewNotes = useStore((state) => state.unsyncedNewNotes)

  const notes = [...storedNotes, ...unsyncedNewNotes]

  // Winning todo
  const [todo, setTodo] = useState(null as null | string)

  // Turnament state
  const [turnament, setTurnament] = useState([] as string[])

  const note = notes.find((note) => note.id === noteId)

  useEffect(() => {
    console.log("Notes changed")
    // Check whether the note has been checked
    if (todo && note) {
      const todoGotChecked = todo.replace("[ ]", "[x]")
      if (note.text.includes(todoGotChecked)) {
        setTodo(todoGotChecked)
        showConfetti()
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
  const nextStandoff = take(2, turnament)

  console.log({ todos, turnament, todo })

  // Not initialized
  if (nextStandoff.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Title>Todo Turnament</Title>
        <p>Let's find your next most imporant task</p>
        <SmartActionButton
          onClick={() => setTurnament(randomizeList(todos))}
          text="Let's go!"
          icon={<GetShitDoneIcon />}
        />
      </div>
    )
  }

  // Winner, winner
  if (nextStandoff.length === 1) {
    return (
      <div className="flex flex-col gap-5">
        <Title>Winner, winner</Title>
        <p>Now set a timer and do it!</p>

        {/* Winner todo */}
        {todo && (
          <div className="p-5 bg-background-secondary rounded-xl">
            <MarkdownCheckbox markdown={todo} noteId={noteId} />
          </div>
        )}

        {/* Winner todo */}
        {todo && todo.includes("[x]") && (
          <div className="flex flex-col gap-5">
            <p>Good work! Continue?</p>
            <SmartActionButton
              onClick={() => setTurnament(randomizeList(todos))}
              text="Let's go!"
              icon={<GetShitDoneIcon />}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <Title>Todo Turnament</Title>

      <p>Let's find your next most imporant task</p>

      {/* Turnament */}
      <div className="flex gap-8 flex-col my-auto">
        <div
          className="flex-1 p-8 bg-background-secondary rounded-xl text-center text-xl font-semibold cursor-pointer"
          onClick={() => {
            if (turnament.length === 2) {
              setTodo(nextStandoff[0])
            }
            setTurnament(randomizeList(deleteAt(1, turnament)))
          }}
        >
          {stripMarkdownCheckboxes(nextStandoff[0])}
        </div>
        <div className="text-4xl font-bold -rotate-[30deg] w-fit m-auto text-color-accent">vs</div>
        <div
          className="flex-1 p-8 bg-background-secondary rounded-xl text-center text-xl font-semibold cursor-pointer"
          onClick={() => {
            if (turnament.length === 2) {
              setTodo(nextStandoff[1])
            }
            setTurnament(randomizeList(deleteAt(0, turnament)))
          }}
        >
          {stripMarkdownCheckboxes(nextStandoff[1])}
        </div>
      </div>
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

function stripMarkdownCheckboxes(markdownText: string): string {
  const checkboxRegex = /- \[ \]/gm

  return markdownText.replace(checkboxRegex, "")
}

function getRandomElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined // Handle empty array case
  }
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

function randomizeList<T>(arr: T[]): T[] {
  if (arr.length === 0) {
    return arr
  }

  if (arr.length === 1) {
    return arr
  }

  const randomIndex = Math.floor(Math.random() * arr.length)

  const item = arr[randomIndex]
  const rest = deleteAt(randomIndex, arr)

  return [item, ...randomizeList(rest)]
}

const deleteAt = (i: number, arr: any[]) => {
  return [...take(i, arr), ...drop(i + 1, arr)]
}
