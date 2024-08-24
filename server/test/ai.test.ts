import { test } from "bun:test"
import { generateCategoriesFromText, generateTagsFromText } from "../src/ai/ai"
import { classifyNoteContent } from "../src/ai/notes"
import { moduleLogger } from "../src/config"

const logger = moduleLogger("ai.test")

const testPrompts = [
  {
    note: "Finish the project proposal by Friday. Review the budget and include the latest market analysis.",
    categories: ["note", "todo"],
    tags: ["project proposal", "budget", "market analysis"],
  },
  {
    note: "The team meeting highlighted the need for better communication channels. We should consider implementing a new project management tool.",
    categories: ["note", "idea"],
    tags: ["team meeting", "communication", "project management", "tool"],
  },
  {
    note: "Today was a productive day. I managed to complete all my tasks and even had time for a long walk in the evening.",
    categories: ["journal"],
    tags: ["productivity", "tasks", "walk"],
  },
  {
    note: "What if we created an app that helps people track their daily water intake? It could have reminders and integrate with wearable devices.",
    tags: ["app", "water intake", "reminders", "wearable devices"],
    categories: ["idea"],
  },
  {
    note: "Buy groceries: milk, eggs, bread, and vegetables. Also, need to get some cleaning supplies and toiletries.",
    categories: ["shopping list"],
    // For a shopping list, we don't need to generate tags
    tags: ["groceries", "milk", "eggs", "bread", "vegetables", "cleaning supplies", "toiletries"],
  },
  {
    note: "Company annual picnic scheduled for next Saturday. Need to arrange for catering and set up a few outdoor games.",
    categories: ["event"],
    tags: ["company picnic", "catering", "outdoor games"],
  },
  {
    note: "Check out this article on AI advancements: https://example.com/ai-advancements",
    categories: ["link"],
    tags: ["AI advancements", "article"],
  },
  {
    note: "Book a flight to New York for the conference next month. Confirm hotel reservations and prepare the presentation slides.",
    categories: ["todo"],
    tags: ["flight", "New York", "conference", "hotel reservations", "presentation slides"],
  },
  {
    note: "Remember to back up the server data before the scheduled maintenance on Sunday.",
    categories: ["note"],
    tags: ["backup", "server data", "maintenance"],
  },
  {
    note: "Had a great time catching up with old friends over dinner. We reminisced about college days and talked about modern plans.",
    categories: ["journal"],
    tags: ["catching up", "friends", "dinner", "college days", "modern plans"],
  },
]

test.skip("createTagsFromNotePrompt", async () => {
  const sample = testPrompts[4]
  const tags = await generateTagsFromText(sample.note)
  logger.debug("Generated tags:", tags)

  const categories = await generateCategoriesFromText(sample.note)
  logger.debug("Generated categories:", categories)

  // for (const { note, tags } of testPrompts) {
  //   expect(prompt).toContain(note)
  //   const result = JSON.parse(await generateText({ model, prompt }))
  //   expect(result).toEqual(tags)
  // }
})

test.only("create tags from note containing a link", async () => {
  const note = "https://affxwrks.com/collections/shop-all"
  const { tags, categories } = await classifyNoteContent(note)

  logger.debug("Tags:", tags)
  logger.debug("Categories:", categories)
})
