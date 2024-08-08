import { publish } from "../../model/api"
import { GenerateTodoListIcon } from "../components/Icons"
import { SmartActionButton } from "../Ui"

export const ViewSmartActions = () => {
  return (
    <SmartActionButton
      onClick={() => {
        publish({ type: "smart-notes:create-todo-list" })
      }}
      text="Generate To-Do List"
      icon={<GenerateTodoListIcon />}
    />
  )
}
