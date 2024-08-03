import { useEffect, useRef } from "react"
import { setNoteInput, useStore } from "../../model/store"

export function NoteInput() {
  const noteInput = useStore((state) => state.noteInput)
  const isMobile = useStore((state) => state.isMobile)

  // Auto focus input using ref and useEffect
  const inputRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    // Only focus on desktop
    if (!isMobile) {
      inputRef.current?.focus()
    }
  }, [])

  return (
    <div className="h-full w-full overflow-hidden">
      <form action="">
        <textarea
          id="note-input"
          ref={inputRef}
          rows={10}
          cols={50}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          spellCheck={false}
          placeholder="New note..."
          className="bg-transparent outline-none text-lg resize-none w-full h-full"
        />
      </form>
    </div>
  )
}
