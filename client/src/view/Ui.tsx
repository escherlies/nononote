import { ClassAttributes, HTMLAttributes, ReactNode, useState } from "react"
import { JSX } from "react/jsx-runtime"
import { toggleMenu, useStore } from "../model/store"
import { MoreActionsIcon } from "./components/Icons"
import { playPress, playRelease } from "../model/sounds"
import { omit } from "rambda"

// Typography

type DefaultProps = {
  children: ReactNode
}

export const Title = (props: DefaultProps) => {
  return <div className="text-3xl font-bold uppercase text-color-accent">{props.children}</div>
}

export const SubTitle = (props: DefaultProps) => {
  return <div className="text-lg font-semibold text-color-accent">{props.children}</div>
}

export const Label = (props: DefaultProps) => {
  return <div className="text-lg font-semibold text-color-accent">{props.children}</div>
}

// Components

export const Section = ({ label, children }: { label?: ReactNode; children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <div className="flex flex-col gap-4 bg-background-secondary p-4 rounded-xl">{children}</div>
    </div>
  )
}

// Inputs

export const MenuButton = (props: DefaultButtonProps) => {
  const menuOpen = useStore((state) => state.menuOpen)

  return (
    <Button {...props} onClick={toggleMenu} active={menuOpen}>
      {/* <div className="w-[54px] h-[54px] rounded-full bg-color-accent"></div> */}
      <div className="w-full h-full flex justify-center items-center p-1 gap-2">
        <MoreActionsIcon />
      </div>
    </Button>
  )
}

export const Button = ({
  active,
  className,
  ...props
}: DefaultButtonProps & { active?: boolean }) => {
  const theme = useStore((state) => state.settings.theme)

  switch (theme) {
    case "modern":
      return <FlatButton active={active} className={className} {...props} />
    case "space-craft":
      return <SpaceButton active={active} className={className} {...props} />
    case "brutalist":
      return <BrutalistButton active={active} className={className} {...props} />
  }
}

export const FlatButton = ({ className, ...props }: DefaultButtonProps & { active?: boolean }) => {
  return (
    <button
      className={`
    w-fit
    min-w-[60px] h-[60px]
    flex items-center justify-center 
    bg-background-secondary
    rounded-xl
    cursor-pointer                            
    transition-all duration-75
    ${className}
    `}
      {...omit(["className"], props)}
    >
      {/* <div className="uppercase tracking-tight text-[40px]">{props.children}</div> */}
      <div className="w-fit h-full flex justify-center items-center p-[14px] gap-2">
        {props.children}
      </div>
    </button>
  )
}

//
export const SpaceButton = ({ className, ...props }: DefaultButtonProps & { active?: boolean }) => {
  return (
    <button
      className={`
    w-fit
    min-w-[60px] h-[60px]
    flex items-center justify-center 
    bg-background-secondary
    rounded-xl
    cursor-pointer                            
    transition-all duration-75
    dark:bg-neutral-800/30
    ${className}
    `}
      {...omit(["className"], props)}
    >
      {/* <div className="uppercase tracking-tight text-[40px]">{props.children}</div> */}
      <div className="w-fit h-full flex justify-center items-center p-[14px] gap-2">
        {props.children}
      </div>
    </button>
  )
}

export const BrutalistButton = ({
  active,
  className,
  ...props
}: DefaultButtonProps & { active?: boolean }) => {
  // Use a state to animate a click event. This should last for 400ms.
  const [isClicked, setClicked] = useState(false)

  const handleSetClicked = (clicked: boolean) => {
    setClicked(clicked)
    if (clicked) {
      playPress()
    } else if (isClicked) {
      playRelease()
    }
  }

  const getClassNames = () => {
    if (isClicked) {
      return "translate-x-0 translate-y-0 shadow-down"
    } else if (active) {
      return "-translate-x-[1px] -translate-y-[1px] shadow-active"
    } else {
      return "-translate-x-[4px] -translate-y-[4px] shadow hover:shadow-hover hover:-translate-x-[2px] hover:-translate-y-[2px]"
    }
  }

  const clickedClassNames = getClassNames()

  return (
    <button
      className={`
    border-[3px] border-color-accent min-w-[68px] h-[68px] flex items-center justify-center bg-background-primary
    rounded-xl
    cursor-pointer
    transition-all duration-75
    ${clickedClassNames}
    ${className}
    `}
      onPointerDown={() => handleSetClicked(true)}
      onPointerUp={() => handleSetClicked(false)}
      onPointerLeave={() => handleSetClicked(false)}
      onPointerCancel={() => handleSetClicked(false)}
      {...omit(["className"], props)}
      // onClick={handleClick}
    >
      {/* <div className="uppercase tracking-tight text-[40px]">{props.children}</div> */}
      <div className="w-fit h-full flex justify-center items-center p-2 gap-2">
        {props.children}
      </div>
    </button>
  )
}

type DefaultButtonProps = JSX.IntrinsicAttributes &
  ClassAttributes<HTMLButtonElement> &
  HTMLAttributes<HTMLButtonElement> & {
    onClick: () => void
  }

export const IconButton = ({
  onClick,
  icon,
  active,
  ariaLabel,
  ...props
}: DefaultButtonProps & { icon: ReactNode; active?: boolean; ariaLabel: string }) => {
  const theme = useStore((state) => state.settings.theme)

  const iconClas = (() => {
    if (theme === "brutalist") {
      return "w-[35px] h-[35px]"
    } else {
      return "w-[28px] h-[28px]"
    }
  })()

  return (
    <Button onClick={onClick} active={active} aria-label={ariaLabel} {...props}>
      <div className={iconClas}>{icon}</div>
    </Button>
  )
}

export const TextButton = ({
  onClick,
  children,
  active,
  ...props
}: DefaultButtonProps & { active?: boolean }) => {
  return (
    <Button
      onClick={onClick}
      active={active}
      {...props}
      className="text-xl font-bold text-color-accent uppercase whitespace-nowrap w-full"
    >
      {children}
    </Button>
  )
}

export const SmartActionButton = ({
  onClick,
  text,
  icon,
}: {
  onClick: () => void
  text: string
  icon: JSX.Element
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex gap-2 bg-color-accent font-mono whitespace-nowrap rounded-lg px-4 py-2 items-center text-white focus:bg-background-secondary focus:text-color-accent"
    >
      <div className="w-full">{text}</div>
      <div className="w-6 h-6">{icon}</div>
    </button>
  )
}
