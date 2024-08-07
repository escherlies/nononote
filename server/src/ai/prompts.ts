// Description: This file contains the prompts for the AI tasks.

// Prompt for the task of extracting the title from a note.
export const createTagsFromNotePrompt = (note: string): string => {
  return `Based on the content of the note, create distinct tags for each significant topic mentioned.
If the text includes compound terms like “ai backend,” the resulting tags will be “ai” and “backend.”
The text input may be in any language.
Translate the tags into English.
Output the tags as a JSON array.

Note:
"${note}"`
}

// Prompt for the task of extracting the categories from a note.
export const createCategoriesFromNotePrompt = (note: string): string => {
  return `Based on the content of the note, classify it into one or more of the following categories: “note,” “todo,” “journal,” “idea,” “shopping list,” “event,” reminder,” or “link.”
The text input may be in any language.
Translate the categories into English.
Output the categories as a JSON array.

Note:
"${note}"`
}

// Prompt for the task of extracting the tags from a webpage as plaintext.
export const createTagsFromWebpageKeywordsPrompt = (textContent: string): string => {
  return `The following is a list of keywords extracted from a webpage.
Generate tags that describe what the webpage is about, using the most general categories possible.
Ignore common webpage keywords like “terms”, “log in”, “sign up”, etc. 
The text input may be in any language.
Translate the tags into English.
Output the tags as a JSON array.

Text:
"${textContent}"`
}

// Prompt for the task of extracting the tags from a webpage as plaintext.
export const createTagsFromWebpageMetaPrompt = (textContent: string): string => {
  return `The following is the meta description of a webpage.
Generate tags that describe what the webpage is about, using the most general categories possible.
The text input may be in any language.
Translate the tags into English.
Output the tags as a JSON array.
  
Here is the meta description:
"${textContent}"`
}

// Prompt for the task of transcribing a voice note.
export const transcribeVoiceNotePrompt = (): string => {
  return "Generate a transcript of the speech."
}
