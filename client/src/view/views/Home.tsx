import { MainButton } from "../Ui"

export function ViewHome() {
  return (
    <div className="flex flex-col gap-20 justify-center items-center">
      <div>New note...</div>
      <MainButton navigateTo="/notes" />
    </div>
  )
}
