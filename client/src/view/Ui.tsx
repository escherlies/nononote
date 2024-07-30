import { ClassAttributes, HTMLAttributes, ReactNode, useState } from "react"
import { JSX } from "react/jsx-runtime"

type DefaultProps = {
  children: ReactNode
}

export const Title = (props: DefaultProps) => {
  return <div className="text-2xl font-bold">{props.children}</div>
}

export const SubTitle = (props: DefaultProps) => {
  return <div className="text-lg font-semibold">{props.children}</div>
}

export const MainButton = ({
  className,
  ...props
}: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => {
  // Use a state to animate a click event. This should last for 400ms.
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 75)
  }

  const clickedClassNames = clicked
    ? "translate-x-1 translate-y-1 shadow-down"
    : "shadow hover:shadow-hover hover:translate-x-[1px] hover:translate-y-[1px]"

  return (
    <div
      className={`
    border-2 border-color-primary rounded-lg w-[68px] min-w-[68px] h-[68px] flex items-center justify-center bg-background-primary
    cursor-pointer
    transition-all duration-75
    ${clickedClassNames}
    ${className}
    `}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)}
      onClick={handleClick}
      {...props}
    >
      <div className="w-[54px] h-[54px] rounded-full bg-color-primary"></div>
    </div>
  )
}

export const TextButton = ({
  className,
  ...props
}: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => {
  // Use a state to animate a click event. This should last for 400ms.
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 75)
  }

  const clickedClassNames = clicked
    ? "translate-x-1 translate-y-1 shadow-down"
    : "shadow hover:shadow-hover hover:translate-x-[1px] hover:translate-y-[1px]"

  return (
    <div
      className={`
    border-2 border-color-primary rounded-lg min-w-[68px] h-[68px] flex items-center justify-center bg-background-primary
    px-10
    cursor-pointer
    transition-all duration-75 ease-in-out
    ${clickedClassNames}
    ${className}
    `}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)}
      onClick={handleClick}
      {...props}
    >
      <div className="uppercase tracking-tight text-[40px]">{props.children}</div>
    </div>
  )
}
