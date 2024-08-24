import z from "zod"

export const magicCode = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string(),
  magicCode: z.string(),
  magicCodeExpiresAt: z.number(),
})
