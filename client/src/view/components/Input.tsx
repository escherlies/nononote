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

  const jsxProps = {
    ...props,
    value: undefined,
    onText: undefined,
    autoFocus: undefined,
  }

  switch (theme) {
    case "modern":
      return (
        <div className="w-full overflow-hidden h-[60px] rounded-xl px-4 flex items-center bg-background-secondary">
          <input
            ref={inputRef}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-2xl italic translate-y-0.5"
            onChange={(e) => props.onText(e.target.value)}
            {...jsxProps}
          />
        </div>
      )

    case "space-craft":
      return (
        <div className="w-full overflow-hidden h-[60px] rounded-xl px-4 flex items-center bg-background-secondary">
          <input
            ref={inputRef}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-2xl italic translate-y-0.5"
            onChange={(e) => props.onText(e.target.value)}
            {...jsxProps}
          />
        </div>
      )

    case "brutalist":
      return (
        <div className="w-full overflow-hidden border-[3px] border-color-accent h-[68px] rounded-xl px-4 flex items-center">
          <input
            ref={inputRef}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-3xl italic uppercase"
            onChange={(e) => props.onText(e.target.value)}
            {...jsxProps}
          />
        </div>
      )
  }
}
