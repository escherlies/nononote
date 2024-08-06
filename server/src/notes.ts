import { z } from "zod"
import { noteDecoder } from "./data/note"
import { emitMessageEvent, MessageWithContext } from "./events"
import { loadAllNotes, loadNote, writeNoteToFile } from "./file-storage"
import { moduleLogger } from "./config"
import { classifyNoteContent } from "./ai/notes"
import monzod from "./db"

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
      return emitMessageEvent({ context, message: { type: "notes:note", note } })
    }

    case "notes:fetch:all": {
      const notes = await loadAllNotes()
      return emitMessageEvent({ context, message: { type: "notes:got-notes", notes } })
    }

    default:
      break
  }
}
