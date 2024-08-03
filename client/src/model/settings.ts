import { z } from "zod"

const SettingsSchema = z.object({
  colorScheme: z.object({
    dark: z.string(),
    light: z.string(),
  }),
  darkMode: z.enum(["auto", "on", "off"]),
  theme: z.enum(["future", "space-craft", "brutalist"]),
})

export type Settings = z.infer<typeof SettingsSchema>

const defaultSettings: Settings = {
  colorScheme: {
    light: "blue-on-gray",
    dark: "white-on-blue",
  },
  darkMode: "auto",
  theme: "future",
}

export const saveSettings = (settings: Settings) => {
  localStorage.setItem("nononotes:settings", JSON.stringify(settings))
}

export const loadSettings = (): Settings => {
  const settings = localStorage.getItem("nononotes:settings")

  if (!settings) {
    return defaultSettings
  }

  const res = SettingsSchema.safeParse(JSON.parse(settings))

  if (!res.success) {
    return defaultSettings
  }

  return res.data
}
