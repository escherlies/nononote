import { ClassAttributes, InputHTMLAttributes, useEffect, useRef } from "react"
import { setSeachQuery, useStore } from "../../model/store"
import { JSX } from "react/jsx-runtime"

export function SearchInput(
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLInputElement> &
    InputHTMLAttributes<HTMLInputElement>
) {
  const theme = useStore((state) => state.settings.theme)

  const value = useStore((state) => state.searchQuery)
  // auto focus input using ref and useEffect
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  switch (theme) {
    case "future":
      return (
        <div className="w-full overflow-hidden h-[60px] rounded-lg px-4 flex items-center bg-background-secondary">
          <input
            id="note-input"
            ref={inputRef}
            value={value}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-2xl italic translate-y-0.5"
            onChange={(e) => setSeachQuery(e.target.value)}
            placeholder="Search"
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
            value={value}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-2xl italic translate-y-0.5"
            onChange={(e) => setSeachQuery(e.target.value)}
            placeholder="Search"
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
            value={value}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-3xl italic uppercase translate-y-0.5"
            onChange={(e) => setSeachQuery(e.target.value)}
            placeholder="Search"
            {...props}
          />
        </div>
      )
  }
}
