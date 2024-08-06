import { z } from 'zod'


export const addTimestamps = (data: z.AnyZodObject) => data
  .merge(z.object({
    created_at: z.number().default(() => new Date().valueOf()).describe("POSIX"),
    updated_at: z.number().default(() => new Date().valueOf()).describe("POSIX"),
  }))
  .strip()



export const omitIdAndTimestamps = (data: z.AnyZodObject) => data
  .omit({
    id: true,
    created_at: true,
    updated_at: true
  })
  .strip()
