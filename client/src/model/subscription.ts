import { isEmpty } from "rambda"
import { appMsg } from "../../../server/src/messages"
import { logger } from "./logger"
import { useStore } from "./store"
import { navigateTo } from "./router"
import { startInitialTour } from "./tours/initial.tour"

export async function onSubscriptionData(message: JSON) {
  const res = await appMsg.safeParseAsync(message)

  logger.debug("Received message: %o", res)

  if (!res.success) {
    console.error("Failed to parse message: ", res.error)
    return
  }

  const data = res.data

  switch (data.type) {
    case "notes:note":
      useStore.setState((state) => {
        const updatedNotes = state.notes.filter((note) => note.id !== data.note.id)
        return { notes: [data.note, ...updatedNotes] }
      })
      break

    case "notes:got-notes": {
      if (isEmpty(data.notes)) {
        startInitialTour()
        return
      }
      useStore.setState((state) => {
        const updatedNotes = state.notes.filter((note) => !data.notes.some((n) => n.id === note.id))
        return { notes: [...data.notes, ...updatedNotes] }
      })
      break
    }

    default:
      break
  }
}
