import { ClassAttributes, InputHTMLAttributes, useEffect, useRef } from "react"
import { useStore } from "../../model/store"
import { JSX } from "react/jsx-runtime"

type Props = JSX.IntrinsicAttributes &
  ClassAttributes<HTMLInputElement> &
  InputHTMLAttributes<HTMLInputElement> & {
    value: string
    onText: (value: string) => void
    autoFocus?: boolean
  }

export function Input(props: Props) {
  const theme = useStore((state) => state.settings.theme)

  // auto focus input using ref and useEffect
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (props.autoFocus) {
      inputRef.current?.focus()
    }
  }, [])

  switch (theme) {
    case "modern":
      return (
        <div className="w-full overflow-hidden h-[60px] rounded-lg px-4 flex items-center bg-background-secondary">
          <input
            ref={inputRef}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-2xl italic translate-y-0.5"
            onChange={(e) => props.onText(e.target.value)}
            {...props}
          />
        </div>
      )

    case "space-craft":
      return (
        <div className="w-full overflow-hidden h-[60px] rounded-lg px-4 flex items-center bg-background-secondary">
          <input
            id="note-input"
            ref={inputRef}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-2xl italic translate-y-0.5"
            onChange={(e) => props.onText(e.target.value)}
            {...props}
          />
        </div>
      )

    case "brutalist":
      return (
        <div className="w-full overflow-hidden border-[3px] border-color-accent h-[68px] rounded-lg px-4 flex items-center">
          <input
            id="note-input"
            ref={inputRef}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-3xl italic uppercase"
            onChange={(e) => props.onText(e.target.value)}
            {...props}
          />
        </div>
      )
  }
}
