import { EventEmitter } from "node:events"
import { z } from "zod"
import { noteDecoder } from "./data"
import { emitMessageEvent } from "./events"

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
])

type NotesMessages = z.infer<typeof notesMessages>

export const handleNotesMessages = (message: NotesMessages) => {
  switch (message.type) {
    case "note:create": {
      // Create note
      const note = {
        id: Math.random().toString(),
        text: message.text,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      // todo: save note to database

      // Emit note to all subscribers
      emitMessageEvent({ type: "note:note", note })
      break
    }

    default:
      break
  }
}
