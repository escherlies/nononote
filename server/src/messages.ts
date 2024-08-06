import { z } from "zod"
import { noteDecoder } from "./data/note"

export const appMsg = z.union([
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
  z.object({
    type: z.literal("auth:authenticate"),
    token: z.string(),
  }),
])

export type AppMsg = z.infer<typeof appMsg>
