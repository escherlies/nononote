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

// Promt for the task of extracting content from an image.
export const generateImageDescriptionPrompt = (): string => {
  return `Please extract and transcribe the content from the following materials, regardless of the medium (e.g., handwritten notes, printed documents, whiteboards, post-it notes, images, etc.) and the language used. The materials may include text, drawings, sketches, graphs, and other visual elements. Provide the extracted text in a clear, structured format, preserving the original layout and context as much as possible. For non-text elements like drawings, sketches, or graphs, describe them in detail and explain their context or significance where relevant.`
}

// Prompt for the task of generating a smart to-do list.
export const generateSmartTodoListPrompt = (notes: string[]): string => {
  const notesEncoded = JSON.stringify(notes)
  return `You are a text analyzer that determines whether each note in a given JSON string array contains any to-do items. 
  The notes are in plain text or markdown format.
  Ignore code blocks and other non-text content.
  A note may contain multiple to-do items, or the note itself may be a single to-do item.
  Analyze each note and extract any lines that are to-do items, removing any bullet points or markdown checkboxes.
  The notes can be in any language.
  Output the extracted to-do items as a JSON string array containing only the text.

Notes:
${notesEncoded}
`
}
