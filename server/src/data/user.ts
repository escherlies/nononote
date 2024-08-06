import z from "zod"

export const user = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    // password: z.string(),
  })
  .strict()

export const publicUser = user
  .pick({
    id: true,
    name: true,
    email: true,
  })
  .strip()

export type User = z.infer<typeof user>

export type PublicUser = z.infer<typeof publicUser>
