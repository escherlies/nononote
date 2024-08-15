import { publish } from "../../model/api"
import { hasSmartAction } from "../../model/store"
import { startGenerateTodosTour } from "../../model/tours/generate-todos.tour"
import { GenerateTodoListIcon } from "../components/Icons"
import { SmartActionButton } from "../Ui"

export const ViewSmartActions = () => {
  return (
    <SmartActionButton
      onClick={() => {
        if (hasSmartAction()) {
          publish({ type: "smart-notes:create-todo-list" })
        } else {
          startGenerateTodosTour()
        }
      }}
      text="Generate To-Do List"
      icon={<GenerateTodoListIcon />}
    />
  )
}
