import { appMsg } from "../../../server/src/messages"
import { useStore } from "./store"

export async function onSubscriptionData(message: JSON) {
  const res = await appMsg.safeParseAsync(message)

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
