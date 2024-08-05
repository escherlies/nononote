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
    case "future":
      return <FutureLayout body={body} footer={footer} />
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

export function FutureLayout({ body, footer }: LayoutType) {
  return (
    <div className="h-svh w-full p-4 flex sm:p-10">
      <div className="flex flex-col m-auto max-w-sm h-full max-h-[800px] gap-2 w-full">
        <div className="relative flex-grow overflow-scroll bg-background-secondary rounded-lg p-4">
          {body}
        </div>
        <div className="w-full max-w-sm mx-auto">{footer}</div>
      </div>
    </div>
  )
}

export function SpaceCraftLayout({ body, footer }: LayoutType) {
  const view = useStore((state) => state.view)
  const viewName = getViewName(view)

  return (
    <div className="h-svh w-full p-4 flex sm:p-10">
      <div className="flex flex-col m-auto max-w-sm h-full max-h-[800px] gap-2 w-full">
        <div
          className={`
          relative
          outline outline-[1.5px] outline-color-text-primary rounded-lg
          flex-grow
          overflow-auto
          `}
        >
          <ViewNameTag viewName={viewName} />
          <div className="overflow-auto h-full flex-grow p-4 pt-8">{body}</div>
        </div>
        <div className="w-full">{footer}</div>
      </div>
    </div>
  )
}

export function BrutalistLayout({ body, footer }: LayoutType) {
  return (
    <div className="h-svh w-full p-4 flex sm:p-10">
      <div className="flex flex-col m-auto max-w-sm h-full max-h-[800px] gap-4 w-full">
        <div className="relative flex-grow overflow-scroll border-[3px] border-color-accent rounded-lg p-4">
          {body}
        </div>
        <div className="w-full max-w-sm mx-auto">{footer}</div>
      </div>
    </div>
  )
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
