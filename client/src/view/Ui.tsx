import { ClassAttributes, HTMLAttributes, ReactNode, useState } from "react"
import { JSX } from "react/jsx-runtime"
import { toggleMenu, useStore } from "../model/store"

type DefaultProps = {
  children: ReactNode
}

export const Title = (props: DefaultProps) => {
  return <div className="text-2xl font-bold">{props.children}</div>
}

export const SubTitle = (props: DefaultProps) => {
  return <div className="text-lg font-semibold">{props.children}</div>
}

export const MenuButton = ({
  ...props
}: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => {
  const menuOpen = useStore((state) => state.menuOpen)

  return (
    <Button {...props} onClick={toggleMenu} active={menuOpen}>
      {/* <div className="w-[54px] h-[54px] rounded-full bg-color-primary"></div> */}
      <div className="flex gap-1">
        <div className="w-[10px] h-[10px] bg-color-primary"></div>
        <div className="w-[10px] h-[10px] bg-color-primary"></div>
        <div className="w-[10px] h-[10px] bg-color-primary"></div>
      </div>
    </Button>
  )
}

export const Button = ({ active, className, ...props }: DefaultButtonProps & { active?: boolean }) => {
  // Use a state to animate a click event. This should last for 400ms.
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 75)
    props.onClick && props.onClick()
  }

  const getClassNames = () => {
    if (clicked) {
      return "translate-x-0 translate-y-0 shadow-down"
    } else if (active) {
      return "-translate-x-[1px] -translate-y-[1px] shadow-active"
    } else {
      return "-translate-x-[4px] -translate-y-[4px] shadow hover:shadow-hover hover:-translate-x-[3px] hover:-translate-y-[3px]"
    }
  }

  const clickedClassNames = getClassNames()

  return (
    <div
      className={`
    border-[3px] border-color-primary w-[68px] min-w-[68px] h-[68px] flex items-center justify-center bg-background-primary
    rounded-lg
    cursor-pointer
    transition-all duration-75
    ${clickedClassNames}
    ${className}
    `}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)}
      {...props}
      onClick={handleClick}
    >
      <div className="uppercase tracking-tight text-[40px]">{props.children}</div>
    </div>
  )
}

type DefaultButtonProps = JSX.IntrinsicAttributes &
  ClassAttributes<HTMLDivElement> &
  HTMLAttributes<HTMLDivElement> & {
    onClick: () => void
  }

export const IconButton = ({ onClick, icon, ...props }: DefaultButtonProps & { icon: ReactNode }) => {
  return (
    <Button onClick={onClick} {...props}>
      {icon}
    </Button>
  )
}
