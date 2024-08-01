import { z } from "zod"

const SettingsSchema = z.object({
  theme: z.object({
    dark: z.string(),
    light: z.string(),
  }),
  darkMode: z.enum(["auto", "on", "off"]),
})

export type Settings = z.infer<typeof SettingsSchema>

const defaultSettings: Settings = {
  theme: {
    light: "blue-on-gray",
    dark: "white-on-blue",
  },
  darkMode: "auto",
}

export const saveSettings = (settings: Settings) => {
  localStorage.setItem("nononotes:settings", JSON.stringify(settings))
}

export const loadSettings = (): Settings => {
  const settings = localStorage.getItem("nononotes:settings")
  if (settings) {
    return SettingsSchema.parse(JSON.parse(settings))
  }

  return defaultSettings
}
