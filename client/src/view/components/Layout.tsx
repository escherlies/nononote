import { ReactNode } from "react"
import { useStore } from "../../model/store"

type LayoutProps = {
  body: ReactNode
  footer: ReactNode
}

export function Layout({ body, footer }: LayoutProps) {
  const menuOpen = useStore((state) => state.menuOpen)

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-sm p-10  m-auto gap-10">
      <div className="relative flex-grow overflow-scroll">
        <div
          // className="fixed inset-0 bg-background-primary/50 p-10 flex backdrop-blur-sm select-none transition-all duration-300"
          className={`fixed inset-0 bg-background-primary/50 p-10 flex backdrop-blur-sm select-none transition-all duration-200 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => {}}
        ></div>
        {body}
      </div>
      <div className="w-full max-w-sm mx-auto">{footer}</div>
    </div>
  )
}
