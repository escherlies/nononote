import z from "zod"

export const stringArrayZ = z.array(z.string())

export const noteDecoder = z.object({
  id: z.string(),
  text: z.string(),
  tags: stringArrayZ,
  categories: stringArrayZ,
  createdAt: z.string(),
  updatedAt: z.string(),
  deleted: z.boolean().optional(),
  userId: z.string().optional(), // TODO: only optional for the client
  smartNote: z.boolean().optional(), // Flag to indicate if the note was created by the smart notes feature
})

export type Note = z.infer<typeof noteDecoder>

// Markdown YAML metadata Interop

export const noteMarkdownYamlMetadataDecoder = z.object({
  id: z.string(),
  tags: z.string().nullable(),
  categories: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
