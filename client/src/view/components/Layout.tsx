import { ReactNode } from "react"

type LayoutProps = {
  body: ReactNode
  footer: ReactNode
}

export function Layout({ body, footer }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full p-10 max-w-sm m-auto">
      <div className="flex-grow">{body}</div>
      <div className="w-full">{footer}</div>
    </div>
  )
}
