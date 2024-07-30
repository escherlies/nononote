import z from "zod"

export const noteDecoder = z.object({
  id: z.string(),
  text: z.string(),
  tags: z.array(z.string()),
})

export type Note = z.infer<typeof noteDecoder>
