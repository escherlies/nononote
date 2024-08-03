// Business logic

// Predefined categories configuration
const categoriesConfig: Record<string, { generateTags: boolean }> = {
  note: { generateTags: true },
  todo: { generateTags: true },
  journal: { generateTags: true },
  idea: { generateTags: true },
  "shopping list": { generateTags: false },
  event: { generateTags: true },
  reminder: { generateTags: true },
  link: { generateTags: true },
}

export const shouldGenerateTags = (categories: string[]): boolean => {
  return categories.some((category) => {
    const config = categoriesConfig[category]
    return config && config.generateTags
  })
}
