import { generateTodoList, hasSmartAction, useStore } from "../../model/store"
import { startGenerateTodosTour } from "../../model/tours/generate-todos.tour"
import { GenerateTodoListIcon } from "../components/Icons"
import { SmartActionButton } from "../Ui"
import { ViewIsCreatingNote } from "./Notes"

export const ViewSmartActions = () => {
  const isCreatingNote = useStore((state) => state.isCreatingNote)
  if (isCreatingNote.tag === "yes") {
    return (
      <div className="h-[100px]">
        <ViewIsCreatingNote />
      </div>
    )
  }

  return (
    <SmartActionButton
      onClick={() => {
        if (hasSmartAction()) {
          generateTodoList()
        } else {
          startGenerateTodosTour()
        }
      }}
      text="Generate To-Do List"
      icon={<GenerateTodoListIcon />}
    />
  )
}
