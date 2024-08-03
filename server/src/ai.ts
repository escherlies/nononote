const { GoogleGenerativeAI } = require("@google/generative-ai")

import { FunctionDeclarationSchemaType } from "@google/generative-ai"
import {
  createCategoriesFromNotePrompt,
  createTagsFromNotePrompt,
} from "./ai/prompts"
import { tagsDecoder } from "./data"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 1,
  },
})

export async function generateTagsFromNoteText(
  note: string
): Promise<string[]> {
  const result = await model.generateContent(createTagsFromNotePrompt(note))
  const response = await result.response
  const text = response.text()

  try {
    const tags = tagsDecoder.parseAsync(JSON.parse(text))
    return tags
  } catch (error) {
    console.error("Failed to parse tags:", error)
    return []
  }
}

export async function generateCategoriesFromNoteText(
  note: string
): Promise<string[]> {
  const result = await model.generateContent(
    createCategoriesFromNotePrompt(note)
  )
  const response = await result.response
  const text = response.text()

  try {
    const categories = tagsDecoder.parseAsync(JSON.parse(text))
    return categories
  } catch (error) {
    console.error("Failed to parse categories:", error)
    return []
  }
}
