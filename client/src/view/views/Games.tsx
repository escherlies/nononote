import { Games } from "../../model/router"
import { ViewFocusFrenzy } from "./games/FocusFrenzy"
import { ViewTodoTurnament } from "./games/TodoTurnament"

type Props = { gameId: Games; noteId: string }
export const ViewGames = ({ gameId, noteId }: Props) => {
  switch (gameId) {
    case "focus-frenzy":
      return <ViewFocusFrenzy noteId={noteId} />
    case "todo-turnament":
      return <ViewTodoTurnament noteId={noteId} />
    default:
      return <div>Game not found 🙁</div>
  }
}
