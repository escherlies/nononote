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
  return `I need a detailed description of an image to help a blind person understand it. Please include the following details in your explanation:

1.	General Overview: Start with a brief summary of the image, including the overall scene and setting.
2.	Main Subjects: Describe the main subjects or focal points in the image, including their positions, actions, and any notable features.
3.	Background and Context: Explain the background elements and the context of the scene, including any relevant details that add to the understanding of the image.
4.	Colors and Textures: Describe the colors and textures present in the image, mentioning any contrasts or notable patterns.
5.	Emotions and Atmosphere: Convey the emotions and atmosphere depicted in the image, including any expressions or moods of the subjects.
6.	Additional Details: Include any other significant details that are present in the image, such as objects, animals, weather conditions, or text.

Make sure your description is vivid and clear, providing as much detail as possible to create a mental image for the blind person.`
}
