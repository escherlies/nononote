import { emitMessageEvent, MessageWithContext } from "./events"
import { moduleLogger } from "./config"
import { classifyNoteContent } from "./ai/notes"
import monzod from "./db"

const logger = moduleLogger("notes")

export const handleNotesMessages = async ({ context, message }: MessageWithContext) => {
  if (context.user === null) {
    logger.error("Unauthorized user")
    return
  }

  switch (message.type) {
    case "notes:create": {
      const { categories, tags } = await classifyNoteContent(message.text).catch((error) => {
        logger.error("Error classifying note content: %o", error)
        return { categories: [] as string[], tags: [] as string[] }
      })

      const note = {
        id: monzod.cols.notes.generateId(),
        text: message.text,
        tags: tags,
        categories: categories,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: context.user.id,
      }

      // Save note
      monzod.cols.notes.insertOne(note)

      // Emit note to all subscribers
      return emitMessageEvent({ context, message: { type: "notes:note", note } })
    }

    case "notes:update": {
      const existingNote = await monzod.cols.notes.findOne({ id: message.id, userId: context.user.id })
      if (!existingNote) {
        // TODO: send error message
        logger.error("Note not found for update: %o %o", message.id, context.user.id)
        return
      }

      // Save note
      const updatedNote = await monzod.cols.notes.findOneAndUpdate(
        { id: message.id },
        { $set: { text: message.text, updatedAt: new Date().toISOString() } },
        { returnDocument: "after" }
      )

      if (!updatedNote) {
        logger.error("Failed to update note: %o", message.id)
        // TODO: send error message
        return
      }

      // Emit note to all subscribers
      return emitMessageEvent({ context, message: { type: "notes:note", note: updatedNote } })
    }

    case "notes:delete": {
      // Mark note as deleted
      const updatedNote = await monzod.cols.notes.findOneAndUpdate(
        { id: message.id, userId: context.user.id },
        { $set: { deleted: true, updatedAt: new Date().toISOString() }, $addToSet: { tags: "deleted" } },
        { returnDocument: "after" }
      )

      if (!updatedNote) {
        // TODO: send error message
        logger.error("Failed to delete note: %o", message.id)
        return
      }

      // Emit note to all subscribers
      return emitMessageEvent({ context, message: { type: "notes:note", note: updatedNote } })
    }

    case "notes:fetch:all": {
      const notes = await monzod.cols.notes.find({ userId: context.user.id }).toArray()
      return emitMessageEvent({ context, message: { type: "notes:got-notes", notes } })
    }

    default:
      break
  }
}
