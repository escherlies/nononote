import { EventEmitter } from "node:events"
import { z } from "zod"
import { noteDecoder } from "./data"
import { emitMessageEvent } from "./events"
import { loadAllNotes, saveNewNote } from "./storage"
import { v7 as uuid } from "uuid"

export const notesMessages = z.union([
  z.object({
    type: z.literal("noop"),
  }),
  z.object({
    type: z.literal("note:create"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("note:note"),
    note: noteDecoder,
  }),
  z.object({
    type: z.literal("note:fetch"),
    id: z.string(),
  }),
  z.object({
    type: z.literal("note:fetch:all"),
  }),
  z.object({
    type: z.literal("note:got-notes"),
    notes: z.array(noteDecoder),
  }),
])

type NotesMessages = z.infer<typeof notesMessages>

export const handleNotesMessages = async (message: NotesMessages) => {
  switch (message.type) {
    case "note:create": {
      // Create note
      const id = "no_" + uuid()

      const note = {
        id: id,
        text: message.text,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      // Save note
      saveNewNote(note)

      // Emit note to all subscribers
      return emitMessageEvent({ type: "note:note", note })
    }

    case "note:fetch": {
      // Fetch note
      // TODO
      break
    }

    case "note:fetch:all": {
      const notes = await loadAllNotes()
      return emitMessageEvent({ type: "note:got-notes", notes })
    }

    default:
      break
  }
}
