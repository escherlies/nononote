import { ReactNode } from "react"
import { useStore } from "../../model/store"
import { getViewName } from "../../model/router"

type LayoutProps = {
  body: ReactNode
  footer: ReactNode
}

export function Layout({ body, footer }: LayoutProps) {
  const theme = useStore((state) => state.settings.theme)

  switch (theme) {
    case "modern":
      return <ModernLayout body={body} footer={footer} />
    case "space-craft":
      return <SpaceCraftLayout body={body} footer={footer} />
    case "brutalist":
      return <BrutalistLayout body={body} footer={footer} />
  }
}

type LayoutType = {
  body: ReactNode
  footer: ReactNode
}

export function ModernLayout({ body, footer }: LayoutType) {
  return [
    <div key="body" className="flex-grow overflow-scroll rounded-xl">
      {body}
    </div>,
    <div key="footer" className="w-full max-w-sm mx-auto">
      {footer}
    </div>,
  ]
}

export function SpaceCraftLayout({ body, footer }: LayoutType) {
  const view = useStore((state) => state.view)
  const viewName = getViewName(view)

  return [
    <div
      key="body"
      className={`
          relative
          outline outline-[1.5px] outline-color-text-primary rounded-xl
          flex-grow
          overflow-auto
          `}
    >
      <ViewNameTag viewName={viewName} />
      <div className="overflow-auto h-full flex-grow p-4 pt-8">{body}</div>
    </div>,
    <div key="footer" className="w-full">
      {footer}
    </div>,
  ]
}

export function BrutalistLayout({ body, footer }: LayoutType) {
  return [
    <div
      key="body"
      className="relative flex-grow overflow-scroll border-[3px] border-color-accent rounded-xl p-4"
    >
      {body}
    </div>,
    <div key="footer" className="w-full max-w-sm mx-auto">
      {footer}
    </div>,
  ]
}

function ViewNameTag({ viewName }: { viewName: string }) {
  return (
    <div
      className={`flex justify-center text-xs
        uppercase font-medium text-center
        bg-color-text-primary text-background-primary
        rounded-bl-lg
        w-1/3
        absolute top-0 right-0
        outline outline-background-primary outline-[1.5px]
        `}
    >
      {viewName}
    </div>
  )
}

export const BodyContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-4 bg-background-secondary overflow-auto h-full rounded-xl">{children}</div>
  )
}
