import { customAlphabet } from "nanoid"

// generate base 58 id
const customNanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 21)

export const autoGenerateId = (collectionName: string) => {
  const prefix = extractInitials(collectionName)
  const id = customNanoid()
  return `${prefix}_${id}`
}

function extractInitials(input: string): string {
  // Check if the string contains any non-alpha characters
  const hasSeparators = /[^a-zA-Z]/.test(input)

  if (hasSeparators) {
    // Split the string by non-alpha characters and take the first character of the first two words
    const words = input.split(/[^a-zA-Z]+/)
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
  } else {
    // If no separators, just take the first two characters of the string
    return input.slice(0, 2)
  }
}
