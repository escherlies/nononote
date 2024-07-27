import { setNoteInput, useStore } from "../../model/store"
import { NoteInput } from "../components/NoteInput"
import { MainButton } from "../Ui"

export function ViewHome() {
  return (
    <div className="flex flex-col gap-20 justify-center items-center">
      <NoteInput />
      <MainButton navigateTo="/notes" />
    </div>
  )
}
