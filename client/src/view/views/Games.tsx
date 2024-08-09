import { Games } from "../../model/router"
import { ViewFocusFrenzy } from "./games/FocusFrenzy"

type Props = { gameId: Games; noteId: string }
export const ViewGames = ({ gameId, noteId }: Props) => {
  switch (gameId) {
    case "focus-frenzy":
      return <ViewFocusFrenzy noteId={noteId} />
    default:
      return <div>Game not found 🙁</div>
  }
}
