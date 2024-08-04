import { z } from "zod"
import { noteDecoder } from "./data"
import { emitMessageEvent } from "./events"
import { loadAllNotes, loadNote, writeNoteToFile } from "./storage"
import { v7 as uuid } from "uuid"
import { moduleLogger } from "./config"
import { classifyNoteContent } from "./ai/notes"

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

      const { categories, tags } = await classifyNoteContent(
        message.text
      ).catch((error) => {
        logger.error("Error classifying note content: %o", error)
        return { categories: [] as string[], tags: [] as string[] }
      })

      const note = {
        id: id,
        text: message.text,
        tags: tags,
        categories: categories,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save note
      await writeNoteToFile(note)

      // Emit note to all subscribers
      return emitMessageEvent({ type: "notes:note", note })
    }

    case "notes:update": {
      const existingNote = await loadNote(message.id)
      if (!existingNote) {
        // TODO: send error message
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
