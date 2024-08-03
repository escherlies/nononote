import { z } from "zod"
import { Note, noteDecoder } from "./data"
import { emitMessageEvent } from "./events"
import { loadAllNotes, loadNote, writeNoteToFile } from "./storage"
import { v7 as uuid } from "uuid"
import { generateCategoriesFromNoteText, generateTagsFromNoteText } from "./ai"
import { shouldGenerateTags } from "./model"
import { moduleLogger } from "./config"

const logger = moduleLogger("notes")

export const notesMessages = z.union([
  z.object({
    type: z.literal("noop"),
  }),
  z.object({
    type: z.literal("notes:create"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("notes:update"),
    id: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("notes:note"),
    note: noteDecoder,
  }),
  z.object({
    type: z.literal("notes:fetch"),
    id: z.string(),
  }),
  z.object({
    type: z.literal("notes:fetch:all"),
  }),
  z.object({
    type: z.literal("notes:got-notes"),
    notes: z.array(noteDecoder),
  }),
])

type NotesMessages = z.infer<typeof notesMessages>

export const handleNotesMessages = async (message: NotesMessages) => {
  switch (message.type) {
    case "notes:create": {
      // Create note
      const id = "no_" + uuid()

      const noteUnclassified = {
        id: id,
        text: message.text,
        tags: [],
        categories: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const note = await classifyNote(noteUnclassified)

      // Save note
      await writeNoteToFile(note)

      // Emit note to all subscribers
      return emitMessageEvent({ type: "notes:note", note })
    }

    case "notes:update": {
      const existingNote = await loadNote(message.id)
      if (!existingNote) {
        // todo: send error message
        return
      }

      const note = {
        ...existingNote,
        text: message.text,
        updatedAt: new Date().toISOString(),
      }

      // Save note
      await writeNoteToFile(note)

      // Emit note to all subscribers
      return emitMessageEvent({ type: "notes:note", note })
    }

    case "notes:fetch:all": {
      const notes = await loadAllNotes()
      return emitMessageEvent({ type: "notes:got-notes", notes })
    }

    default:
      break
  }
}

const classifyNote = async (note: Note) => {
  // Generate categories
  const categories = await generateCategoriesFromNoteText(note.text)

  const tags = shouldGenerateTags(categories)
    ? await generateTagsFromNoteText(note.text)
    : []

  logger.debug("Classified note %o", { note, categories, tags })

  return { ...note, categories, tags }
}
