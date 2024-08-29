import {
  formatTodosAsMarkdown,
  generateCategoriesFromText,
  generateNoteTitleIfMissing,
  generateTagsFromText,
  generateTagsFromWebpage,
} from "./ai"
import { extractLinks, getWebpageContent } from "./helpers/webpage"

export const classifyNoteContent = async (textContent: string) => {
  // Generate categories
  const categories = await generateCategoriesFromText(textContent)

  // Generate tags
  const tags = await handleTagsGeneration(textContent, categories)

  // Generate a title
  const title = await generateNoteTitleIfMissing(textContent)

  // Format links
  const textContentFormatted = formatLinks(textContent)

  // Format todos as markdown, if note is todo
  let noteWithTitle = title.trim() !== "#" ? title + "\n" + textContentFormatted : textContentFormatted

  // Format a task list as markdown
  noteWithTitle = await formatTodosAsMarkdown(noteWithTitle)

  return { categories, tags: tags || [], text: noteWithTitle }
}

const handleTagsGeneration = async (textContent: string, categories: string[]) => {
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

  const cleanedUrl = removeSearchParams(urlFromNote)

  const webpage = await getWebpageContent(cleanedUrl)
  if (!webpage) {
    return []
  }

  return generateTagsFromWebpage(webpage.text, webpage.type)
}

export const removeSearchParams = (url: string) => {
  const urlObj = new URL(url)
  urlObj.search = ""
  return urlObj.toString()
}

export const formatAsMarkdownLink = ({ text, url }: { text: string; url: string }) => {
  return `[${text}](${url})`
}

export const formatLinks = (textContent: string) => {
  const links = extractLinks(textContent)
  if (!links.length) {
    return textContent
  }

  const cleanedLinks = links.map((link) => {
    const cleaned = removeSearchParams(link)
    return {
      original: link,
      cleaned: formatAsMarkdownLink({ text: cleaned, url: cleaned }),
    }
  })

  const cleanedText = cleanedLinks.reduce((acc, link) => {
    return acc.replace(link.original, link.cleaned)
  }, textContent)

  return cleanedText
}
