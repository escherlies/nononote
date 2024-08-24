import { ReactNode } from "react"
import { navigateTo } from "../../model/router"
import { Title } from "../Ui"

type Props = {
  noteId: string
}
export const ViewTodoGame = ({ noteId }: Props) => {
  return (
    <div className="flex flex-col gap-5 w-full h-full">
      <Title>Play a game</Title>

      {/* Todo Turnament */}
      <Card
        title="Todo Turnament"
        icon={<BoxingIcon />}
        onClick={() =>
          navigateTo({ tag: "PlayTodoGameGame", noteId: noteId, gameId: "todo-turnament" })
        }
        content={
          <p>
            Determine the most important task by pitting your todos against each other until one
            emerges as the ultimate priority.
          </p>
        }
        // badge={true}
      />

      {/* Time Attack */}
      {/* <Card
        title="Time Attack"
        icon={<TimerIcon />}
        content={<p>Set a timer and see how many tasks you can complete within that time.</p>}
        badge={true}
      /> */}

      {/* Focus Frenzy */}
      <Card
        title="Focus Frenzy"
        onClick={() =>
          navigateTo({ tag: "PlayTodoGameGame", noteId: noteId, gameId: "focus-frenzy" })
        }
        icon={<ShuffleIcon />}
        content={<p>Picks a random task to work on for a set time period.</p>}
      />
    </div>
  )
}

const ComingSoonBadge = () => {
  return (
    <div className="text-xs bg-color-accent px-1 text-white uppercase dark:text-background-primary cursor-pointer">
      Coming soon
    </div>
  )
}

export const Card = ({
  title,
  icon,
  content,
  onClick,
  badge,
}: {
  title: string
  icon: ReactNode
  content: ReactNode
  onClick?: () => void
  badge?: boolean
}) => {
  return (
    <button
      className="flex flex-col gap-2 px-4 pt-4 pb-10 rounded-xl bg-background-secondary relative cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex gap-2 h-10 items-center justify-center">
        <div className="w-9 h-9">{icon}</div>
        <div className="w-full flex items-end">
          <div className="flex-1 font-mono text-xl font-bold line-clamp-1 border-b border-b-color-text-primary">
            <span>{title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm">{content}</div>

      {/* Badge */}
      {badge && (
        <div className="absolute bottom-4 right-4">
          <ComingSoonBadge />
        </div>
      )}
    </button>
  )
}

const BoxingIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.982 11.246c-.087 2.723 3.12 6.078 6.129 7.133m-6.13-7.133c-.304.523-3.415 3.017-3.47 4.073c-.263 2.098 3.301 6.039 6.05 6.173c1.026.146 2.449-1.58 3.892-2.864c.795-.707 1.94-.87 6.524-2.008c1.664-.289 3.663-3.159.7-5.59m-13.695.216c.928-2.201 2.532-6.456 5.68-8.137c1.277-.726 4.597-1.394 7.85 1.698c1.119.94 3.058 3.002 1.253 5.377c-1.204 1.403-3.024.997-3.2 3.423"
        color="currentColor"
      />
    </svg>
  )
}

const ShuffleIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        color="currentColor"
      >
        <path d="m16.5 17.5l1.5-1.75h-1.86c-1.047 0-1.571 0-2.013-.222c-.443-.222-.733-.63-1.315-1.448L9.855 9.92c-.581-.818-.872-1.226-1.314-1.448s-.966-.222-2.014-.222H6M16.5 6.5L18 8.25h-1.86c-1.047 0-1.571 0-2.013.222c-.443.222-.733.63-1.315 1.448M6 15.75h.526c1.048 0 1.572 0 2.014-.222s.733-.63 1.314-1.448" />
        <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12" />
      </g>
    </svg>
  )
}
