import * as cheerio from "cheerio"

import { htmlToText } from "html-to-text"

import { pipe } from "rambda"
import { moduleLogger } from "../../config"

const logger = moduleLogger("webpage")

export async function getWebpageContent(url: string): Promise<{
  type: "metaDescription" | "bodyAsKeywords"
  text: string
} | null> {
  try {
    // Fetch the HTML of the webpage
    const res = await fetch(url)
    const body = await res.text()

    // Load the HTML into cheerio
    const cheers = cheerio.load(body)

    // Remove script and style elements
    cheers("script, style, iframe").remove()

    const metaDescription = cheers("meta[name='description']").attr("content")
    // or og:description
    const ogDescription = cheers("meta[property='og:description']").attr(
      "content"
    )

    const description = metaDescription || ogDescription || ""

    // If a description is found in the meta tags, return it
    if (description) {
      return { type: "metaDescription", text: description }
    }

    // Else, get the text content of the webpage

    // Get the HTML content after removing script and style tags
    const cleanedHtml = cheers.html()

    // Convert HTML to plain text
    const plainText = htmlToText(cleanedHtml, {
      wordwrap: false,
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "img", options: { ignoreHref: true } },
      ],
    })

    // Process the plain text using a pipeline of functions
    const processedText = processTextPipeline(plainText)

    return { type: "bodyAsKeywords", text: processedText }
  } catch (error) {
    logger.error(`Error fetching the webpage: ${error}`)
    return null
  }
}

// ##################################################################### //
// ################ Helper functions for text processing ############### //
// ##################################################################### //

const removeLinks = (text: string): string => {
  return text.replace(/https?:\/\/[^\s]+/g, "")
}

const removeNonAlphanumericWords = (text: string): string => {
  return text
    .split(/\s+/)
    .filter((word) => /^[a-z0-9]+$/i.test(word))
    .join(" ")
}

const removeDuplicateWords = (text: string): string => {
  const words = text.split(/\s+/)
  const uniqueWords = Array.from(new Set(words))
  return uniqueWords.join(" ")
}

const toLowerCaseAndLimit = (text: string): string => {
  return text.toLowerCase().slice(0, 3000)
}

// Create a pipeline of text processing functions
const processTextPipeline = pipe(
  removeLinks,
  removeNonAlphanumericWords,
  removeDuplicateWords,
  toLowerCaseAndLimit,
  // comma seperate words
  (text) => text.replace(/\s+/g, ", ")
)

export function extractLinks(text: string): string[] {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g

  // Find all matches in the text
  const matches = text.match(urlRegex)

  // Return the array of matches or an empty array if no matches found
  return matches || []
}
