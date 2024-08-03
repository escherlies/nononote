import z from "zod"

export const tagsDecoder = z.array(z.string())

export const noteDecoder = z.object({
  id: z.string(),
  text: z.string(),
  tags: tagsDecoder,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Note = z.infer<typeof noteDecoder>

// Markdown YAML metadata Interop

export const noteMarkdownYamlMetadataDecoder = z.object({
  id: z.string(),
  tags: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
