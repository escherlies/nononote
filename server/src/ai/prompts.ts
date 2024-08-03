// Description: This file contains the prompts for the AI tasks.

export const createTagsFromNotePrompt = (note: string): string => {
  return `Based on the content of the note, create distinct tags for each significant topic mentioned.
If the text includes compound terms like “ai backend,” the resulting tags will be “ai” and “backend.”
The text input may be in any language.
Translate the tags into English.
Output the tags as a JSON array.

Note:
"${note}"`
}

export const createCategoriesFromNotePrompt = (note: string): string => {
  return `Based on the content of the note, classify it into one or more of the following categories: “note,” “todo,” “journal,” “idea,” “shopping list,” “event,” reminder,” or “link.”
The text input may be in any language.
Translate the categories into English.
Output the categories as a JSON array.

Note:
"${note}"`
}
