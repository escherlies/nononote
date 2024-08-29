import { emitMessageEvent, type MessageWithContext } from "./events"
import { moduleLogger } from "./config"
import { classifyNoteContent } from "./ai/notes"
import monzod from "./db"
import { generateSmartTodoList, groupTasklistItems } from "./ai/ai"
import type { Note } from "./data/note"
import { last, prop } from "rambda"

const logger = moduleLogger("notes")

export const handleNotesMessages = async ({ context, message }: MessageWithContext) => {
  if (context.user === null) {
    logger.error("Unauthorized user")
    return
  }

  switch (message.type) {
    case "notes:create": {
      const { categories, tags, text } = await classifyNoteContent(message.text).catch((error) => {
        logger.error("Error classifying note content: %o", error)
        return { categories: [] as string[], tags: [] as string[], text: message.text }
      })

      const note = {
        id: monzod.cols.notes.generateId(),
        text: text,
        // Todo: add original text to note
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
      const smartNotes = await monzod.cols.notes
        .find({
          userId: context.user.id,
          smartNote: true,
          deleted: { $ne: true },
        })
        .toArray()

      const lastSmartNote = last(smartNotes) as Note | undefined

      const notes = await monzod.cols.notes
        .find({
          userId: context.user.id,
          // Include only that have previously been classified as todo
          // categories: { $in: ["todo"] },
          // Exclude deleted notes and smart notes
          deleted: { $ne: true },
          smartNote: { $ne: true },
          // Only include notes that have been created after the last smart note
          createdAt: { $gt: lastSmartNote?.createdAt || new Date(0).toISOString() },
        })
        .toArray()

      const notesContent = notes
        .map((note) => {
          if (note.categories.includes("todo")) {
            return note
          } else {
            return { text: extractTodosFromNote(note) }
          }
        })
        .reverse()
        .map(prop("text"))
        // Filter empty notes
        .filter((note) => note.length > 0)
        // Carry over unchecked todos from the last smart note
        .concat([lastSmartNote?.text || ""])

      // Generate a todo list from notes
      const todos = await generateSmartTodoList(notesContent)

      // If todos are empty, create a todo with "Create a to-do list ☺️" text and add a paragraph stating that no todos were found
      if (todos.length === 0) {
        const text = `No to-dos were found in your recent notes. 🤔 Looks like you have just one task for now:

- [ ] Create a to-do list ☺️

Simply jot down your tasks in a note, and we’ll take care of the rest. 🤖`

        // Create a new note with the todo list
        const note: Note = {
          id: monzod.cols.notes.generateId(),
          text: text,
          tags: ["todo"],
          categories: ["todo"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: context.user.id,
          smartNote: true,
        }

        // Save note
        await monzod.cols.notes.insertOne(note)

        // Emit note to all subscribers
        return emitMessageEvent({ context, message: { type: "notes:note", note } })
      }
      // Continue with the normal flow

      const todosAsMarkdownTasklist = formatRawTodos(todos)

      const todosSorted = await groupTasklistItems(todosAsMarkdownTasklist)

      // Create a new note with the todo list
      const note: Note = {
        id: monzod.cols.notes.generateId(),
        text: todosSorted,
        tags: ["todo"],
        categories: ["todo"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: context.user.id,
        smartNote: true,
      }

      // Save note
      await monzod.cols.notes.insertOne(note)

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
      return `- [ ] ${todo}`
    })
    .join("\n")

  return formattedTodos
}

function extractTodosFromNote(note: Note) {
  // If a note is not categorized as todo, extract possible todos from it
  // Strip away all non-todo content
  // The Todos are in markdown list or task list format
  // - [ ] Task 1
  // - [x] Task 2
  // - Task 3
  // - Task 4

  // Extract todos from notes
  const lines = note.text.split("\n")
  // Filter out lines that are not todos
  const todos = lines.filter((line) => {
    // Check if line is a markdown task list or list item
    return line.match(/- \[ \] /) || line.match(/- \[x\] /) || line.match(/- /)
  })
  return todos.join("\n")
}
