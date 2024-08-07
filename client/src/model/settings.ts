import { z } from "zod"
import { storage } from "./storage"

const SettingsSchema = z.object({
  colorScheme: z.object({
    dark: z.string(),
    light: z.string(),
  }),
  darkMode: z.enum(["auto", "on", "off"]),
  theme: z.enum(["modern", "space-craft", "brutalist"]),
  buttonSound: z.boolean(),
})

export type Settings = z.infer<typeof SettingsSchema>

export const defaultSettings: Settings = {
  colorScheme: {
    light: "blue-on-white",
    dark: "blue-on-night",
  },
  darkMode: "auto",
  theme: "brutalist",
  buttonSound: true,
}

export const saveSettings = (settings: Settings) => {
  storage.setItem("settings", JSON.stringify(settings))
}

export const loadSettings = (): Settings => {
  const settings = storage.getItem("settings")

  if (!settings) {
    return defaultSettings
  }

  const res = SettingsSchema.safeParse(JSON.parse(settings))

  if (!res.success) {
    return defaultSettings
  }

  return res.data
}
