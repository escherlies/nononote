import { useEffect, useRef } from "react"
import { setNoteInput, useStore } from "../../model/store"

export function NoteInput() {
  const noteInput = useStore((state) => state.noteInput)
  // auto focus input using ref and useEffect
  const inputRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="h-full w-full">
      <textarea
        ref={inputRef}
        rows={10}
        cols={50}
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        spellCheck={false}
        className="bg-transparent outline-none text-lg resize-none w-full h-full"
      />
    </div>
  )
}
