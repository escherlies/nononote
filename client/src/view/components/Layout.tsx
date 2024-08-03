import { ReactNode } from "react"

type LayoutProps = {
  body: ReactNode
  footer: ReactNode
}

export function Layout({ body, footer }: LayoutProps) {
  return (
    <div className="h-svh w-full p-4 flex sm:p-10">
      <div className="flex flex-col m-auto max-w-sm h-full max-h-[800px] gap-5 w-full">
        <div className="relative flex-grow overflow-scroll bg-neutral-200/50 rounded-lg p-4">
          {body}
        </div>
        <div className="w-full max-w-sm mx-auto">{footer}</div>
      </div>
    </div>
  )
}
