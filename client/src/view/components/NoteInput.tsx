import { useEffect, useRef } from "react"
import { setNoteInput, useStore } from "../../model/store"
import { IS_MOBILE_PLATTFORM } from "../../model/config"

export const NoteInput = () => {
  const noteInput = useStore((state) => state.noteInput)

  // Auto focus input using ref and useEffect
  const inputRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    // Only focus on desktop
    if (!IS_MOBILE_PLATTFORM) {
      inputRef.current?.focus()
    }
  }, [])

  return (
    <div className="h-full overflow-hidden p-4 bg-background-secondary rounded-xl">
      <textarea
        id="note-input"
        ref={inputRef}
        rows={1}
        cols={50}
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        spellCheck={false}
        placeholder="New note..."
        className="bg-transparent outline-none text-lg resize-none w-full h-full border-none focus:ring-2 focus:ring-color-accent rounded"
      />
    </div>
  )
}
