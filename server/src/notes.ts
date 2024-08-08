import { emitMessageEvent, MessageWithContext } from "./events"
import { moduleLogger } from "./config"
import { classifyNoteContent } from "./ai/notes"
import monzod from "./db"
import { generateSmartTodoList } from "./ai/ai"
import { Note } from "./data/note"
import { prop } from "rambda"

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

    case "smart-notes:create-todo-list": {
      const notes = await monzod.cols.notes
        .find({
          userId: context.user.id,
          // Include only that have previously been classified as todo
          categories: { $in: ["todo"] },
          // Exclude deleted notes and smart notes
          deleted: { $ne: true },
          smartNote: { $ne: true },
        })
        .toArray()

      // Extract text from notes
      const notesContent = notes.reverse().map(prop("text"))

      // Generate a todo list from notes
      const todos = await generateSmartTodoList(notesContent)

      // Create a new note with the todo list
      const note: Note = {
        id: monzod.cols.notes.generateId(),
        text: formatRawTodos(todos),
        tags: ["todo"],
        categories: ["todo"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: context.user.id,
        smartNote: true,
      }

      // Save note
      // await monzod.cols.notes.insertOne(note)

      // Emit note to all subscribers
      return emitMessageEvent({ context, message: { type: "notes:note", note } })
    }

    default:
      break
  }
}
function formatRawTodos(todos: string[]): string {
  // Format todo text with markdown checkboxes
  const formattedTodos = todos
    .map((todo) => {
      const todoRaw = todo.replace(/- \[ \] /g, "").replace(/- \[x\] /g, "")
      return `- [ ] ${todoRaw}`
    })
    .join("\n")

  return formattedTodos
}
