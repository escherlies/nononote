import { ReactNode } from "react"

type LayoutProps = {
  body: ReactNode
  footer: ReactNode
}

export function Layout({ body, footer }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full max-w-screen-sm p-10  m-auto gap-10">
      <div className="flex-grow overflow-scroll">{body}</div>
      <div className="w-full">{footer}</div>
    </div>
  )
}
