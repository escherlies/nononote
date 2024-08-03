import fs from "fs/promises"
import yaml from "yaml"

import { Note, noteMarkdownYamlMetadataDecoder } from "./data"
import { moduleLogger, NOTES_FOLDER } from "./config"

const logger = moduleLogger("storage")

// ##################################################################### //
// ########################### Notes database ########################## //
// ##################################################################### //

// Will use a simple file-based database for now

export const writeNoteToFile = async (note: Note) => {
  const formattedNote = formatNoteAsMarkdown(note)
  fs.writeFile(`${NOTES_FOLDER}/${note.id}.md`, formattedNote)
}

export const loadAllNotes = async (): Promise<Note[]> => {
  const files = await fs.readdir(NOTES_FOLDER)

  const notes = await Promise.all(
    files.map(async (file) => {
      const isFile = (await fs.stat(`${NOTES_FOLDER}/${file}`)).isFile()
      if (!isFile) return null
      const content = await fs.readFile(`${NOTES_FOLDER}/${file}`, "utf-8")
      const parsed = await parseFromMarkdown(content)
      return parsed
    })
  )

  const cleanedNotes = notes.filter((note) => note !== null)

  return cleanedNotes
}

export const loadNote = async (id: string): Promise<Note | null> => {
  try {
    const content = await fs.readFile(`${NOTES_FOLDER}/${id}.md`, "utf-8")
    const parsed = await parseFromMarkdown(content)
    return parsed
  } catch (err) {
    logger.error("Error loading note: %o", err)
    return null
  }
}

// Parsers

const formatNoteAsMarkdown = (note: Note) => {
  const markdownContent = `---
id: ${note.id}
created_at: ${note.createdAt}
updated_at: ${note.updatedAt}
tags: ${note.tags.join(", ")}
categories: ${note.categories.join(", ")}
---

${note.text}
`
  return markdownContent
}

async function parseFromMarkdown(content: string) {
  try {
    const contentParts = content.split("---")

    if (contentParts.length < 3) {
      throw new Error("Invalid markdown format")
    }

    const yamlContent = contentParts[1].trim()
    const noteContent = contentParts[2].trim()

    const metadata = yaml.parse(yamlContent)

    const parsed = await noteMarkdownYamlMetadataDecoder.parseAsync(metadata)

    const note: Note = {
      id: parsed.id,
      text: noteContent,
      tags: splitTags(parsed.tags),
      categories: splitTags(parsed.categories),
      createdAt: parsed.created_at,
      updatedAt: parsed.updated_at,
    }

    return note
  } catch (err) {
    logger.error("Error parsing markdown: %o", err)
    return null
  }
}

const splitTags = (tags: string | null) => {
  if (!tags) return []
  return tags.split(",").map((tag) => tag.trim())
}
