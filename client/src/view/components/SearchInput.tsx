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
    // Only focus if the input is empty
    if (value === "") {
      inputRef.current?.focus()
    }
  }, [])

  switch (theme) {
    case "modern":
      return (
        <input
          id="note-input"
          ref={inputRef}
          value={value}
          spellCheck={false}
          className="w-full overflow-hidden h-[60px] rounded-xl px-4 flex items-center bg-background-secondary border-none italic text-2xl outline-none"
          onChange={(e) => setSeachQuery(e.target.value)}
          placeholder="Search"
          {...props}
        />
      )

    case "space-craft":
      return (
        <div className="w-full overflow-hidden h-[60px] rounded-xl px-4 flex items-center bg-background-secondary">
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
        <div className="w-full overflow-hidden border-[3px] border-color-accent h-[68px] rounded-xl px-4 flex items-center">
          <input
            id="note-input"
            ref={inputRef}
            value={value}
            spellCheck={false}
            className="bg-transparent outline-none resize-none w-full text-3xl italic uppercase"
            onChange={(e) => setSeachQuery(e.target.value)}
            placeholder="..."
            {...props}
          />
        </div>
      )
  }
}
