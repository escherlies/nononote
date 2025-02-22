import { GenerativeModel, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"

import type { FileMetadataResponse } from "@google/generative-ai/server"

import {
  createCategoriesFromNotePrompt,
  createTagsFromNotePrompt,
  createTagsFromWebpageKeywordsPrompt,
  createTagsFromWebpageMetaPrompt,
  formatTasksAsMarkdownPrompt,
  generateImageDescriptionPrompt,
  generateNoteTitleIfMissingPrompt,
  generateSmartTodoListPrompt,
  organizeAndSortTasksPrompt,
  transcribeVoiceNotePrompt,
} from "./prompts"

import { stringArrayZ } from "../data/note"

import { GOOGLE_GENERATIVE_AI_API_KEY, moduleLogger } from "../config"

const logger = moduleLogger("ai")

const genAI = new GoogleGenerativeAI(GOOGLE_GENERATIVE_AI_API_KEY)

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
]

const FLASH_MODEL = "gemini-1.5-flash-002"
const PRO_MODEL = "gemini-1.5-pro-002"

const geminiFlashModel = genAI.getGenerativeModel({
  model: FLASH_MODEL,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 1,
  },
  safetySettings: SAFETY_SETTINGS,
})

const geminiProModel = genAI.getGenerativeModel({
  model: PRO_MODEL,
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 1,
  },
  safetySettings: SAFETY_SETTINGS,
})

const generateFromTextWithPrompt = async (model: GenerativeModel, prompt: string): Promise<string> => {
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  return text
}

const parseStringArray = async (text: string): Promise<string[]> => {
  try {
    const literals = await stringArrayZ.parseAsync(JSON.parse(text))
    const lowercased = literals.map((l) => l.toLowerCase())
    return lowercased
  } catch (error) {
    logger.error("Failed to parse string array:", error)
    return []
  }
}

// Tags

export async function generateTagsFromText(content: string): Promise<string[]> {
  const text = await generateFromTextWithPrompt(geminiProModel, createTagsFromNotePrompt(content))

  return parseStringArray(text)
}

// Categories

export async function generateCategoriesFromText(content: string): Promise<string[]> {
  const text = await generateFromTextWithPrompt(geminiProModel, createCategoriesFromNotePrompt(content))

  return parseStringArray(text)
}

// Title

export async function generateNoteTitleIfMissing(content: string): Promise<string> {
  const text = await generateFromTextWithPrompt(
    genAI.getGenerativeModel({
      model: FLASH_MODEL,
      generationConfig: {},
      safetySettings: SAFETY_SETTINGS,
    }),
    generateNoteTitleIfMissingPrompt(content)
  )

  return text
}

// Gen Todos

export async function formatTodosAsMarkdown(content: string): Promise<string> {
  const text = await generateFromTextWithPrompt(
    genAI.getGenerativeModel({
      model: PRO_MODEL,
      generationConfig: {},
      safetySettings: SAFETY_SETTINGS,
    }),
    formatTasksAsMarkdownPrompt(content)
  )

  return text
}

// Tags from webpage

export async function generateTagsFromWebpage(
  content: string,
  type: "bodyAsKeywords" | "metaDescription"
): Promise<string[]> {
  let text: string = ""
  switch (type) {
    case "bodyAsKeywords":
      // Use the pro model for body text
      text = await generateFromTextWithPrompt(geminiProModel, createTagsFromWebpageKeywordsPrompt(content))
      break
    case "metaDescription":
      // Use the flash model for meta descriptions
      text = await generateFromTextWithPrompt(geminiFlashModel, createTagsFromWebpageMetaPrompt(content))
      break
  }

  return parseStringArray(text)
}

// ##################################################################### //
// ############################### Voice ############################### //
// ##################################################################### //

export async function transcribeVoiceNote(voiceNote: FileMetadataResponse): Promise<string> {
  const result = await genAI
    .getGenerativeModel({
      model: FLASH_MODEL,
      safetySettings: SAFETY_SETTINGS,
    })
    .generateContent([
      {
        fileData: {
          mimeType: voiceNote.mimeType,
          fileUri: voiceNote.uri,
        },
      },
      transcribeVoiceNotePrompt(),
    ])

  const text = result.response.text()

  return text
}

// ##################################################################### //
// ############################### Images ############################## //
// ##################################################################### //

export async function describeImage(image: FileMetadataResponse): Promise<string> {
  const result = await genAI
    .getGenerativeModel({
      model: PRO_MODEL,
      safetySettings: SAFETY_SETTINGS,
    })
    .generateContent([
      {
        fileData: {
          mimeType: image.mimeType,
          fileUri: image.uri,
        },
      },
      generateImageDescriptionPrompt(),
    ])

  const text = result.response.text()

  return text
}

// ##################################################################### //
// ########################### Smart Actions ########################### //
// ##################################################################### //

export async function generateSmartTodoList(content: string[]): Promise<string[]> {
  const result = await genAI
    .getGenerativeModel({
      model: PRO_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
      safetySettings: SAFETY_SETTINGS,
    })
    .generateContent(generateSmartTodoListPrompt(content))

  const response = result.response.text()

  const json = JSON.parse(response)

  return json
}

export async function groupTasklistItems(content: string): Promise<string> {
  const result = await genAI
    .getGenerativeModel({
      model: PRO_MODEL,
      generationConfig: {
        temperature: 0.7,
      },
      safetySettings: SAFETY_SETTINGS,
    })
    .generateContent([organizeAndSortTasksPrompt(content)])

  const response = result.response.text()

  return response
}
