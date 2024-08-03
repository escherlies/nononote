import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"

import {
  createCategoriesFromNotePrompt,
  createTagsFromNotePrompt,
  createTagsFromWebpageKeywordsPrompt,
  createTagsFromWebpageMetaPrompt,
} from "./prompts"

import { stringArrayZ } from "../data"

import { GOOGLE_GENERATIVE_AI_API_KEY } from "../config"

const genAI = new GoogleGenerativeAI(GOOGLE_GENERATIVE_AI_API_KEY)

const geminiFlashModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 1,
  },
})

const geminiProModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 1,
  },
})

const generateFromTextWithPrompt = async (
  model: GenerativeModel,
  prompt: string
): Promise<string> => {
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
    console.error("Failed to parse string array:", error)
    return []
  }
}

export async function generateTagsFromText(content: string): Promise<string[]> {
  const text = await generateFromTextWithPrompt(
    geminiFlashModel,
    createTagsFromNotePrompt(content)
  )

  return parseStringArray(text)
}

export async function generateCategoriesFromText(
  content: string
): Promise<string[]> {
  const text = await generateFromTextWithPrompt(
    geminiFlashModel,
    createCategoriesFromNotePrompt(content)
  )

  return parseStringArray(text)
}

export async function generateTagsFromWebpage(
  content: string,
  type: "bodyAsKeywords" | "metaDescription"
): Promise<string[]> {
  let text: string = ""
  switch (type) {
    case "bodyAsKeywords":
      // Use the pro model for body text
      text = await generateFromTextWithPrompt(
        geminiProModel,
        createTagsFromWebpageKeywordsPrompt(content)
      )
      break
    case "metaDescription":
      // Use the flash model for meta descriptions
      text = await generateFromTextWithPrompt(
        geminiFlashModel,
        createTagsFromWebpageMetaPrompt(content)
      )
      break
  }

  return parseStringArray(text)
}
