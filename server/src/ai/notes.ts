import {
  generateCategoriesFromText,
  generateTagsFromText,
  generateTagsFromWebpage,
} from "./ai"
import { extractLinks, getWebpageContent } from "./helpers/webpage"

export const classifyNoteContent = async (textContent: string) => {
  // Generate categories
  const categories = await generateCategoriesFromText(textContent)

  // Generate tags
  const tags = await handleTagsGeneration(textContent, categories)

  return { categories, tags: tags || [] }
}

const handleTagsGeneration = async (
  textContent: string,
  categories: string[]
) => {
  if (categories.includes("shopping list") || categories.includes("code")) {
    // Don't generate tags for shopping lists
    return []
  }

  if (categories.includes("link")) {
    // Generate tags based on the links content
    return handleLinkTagsGeneration(textContent)
  }

  return generateTagsFromText(textContent)
}

export const handleLinkTagsGeneration = async (textContent: string) => {
  const urlFromNote = extractLinks(textContent)[0]
  if (!urlFromNote) {
    return []
  }

  const webpage = await getWebpageContent(urlFromNote)
  if (!webpage) {
    return []
  }

  return generateTagsFromWebpage(webpage.text, webpage.type)
}
