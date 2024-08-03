import { updateSettings, useStore } from "../../../model/store"
import { Settings } from "../../../model/settings"

const schemes = [
  { tag: "blue-on-white", colors: ["#001aff", "#fffefd", "#f2f2f2", "#e6e6e6"], kind: "light" },
  { tag: "teal-on-pale-blue", colors: ["#1b2c2e", "#f7fbfc", "#e0f1f2", "#cfe8ea"], kind: "light" },
  { tag: "white-on-blue", colors: ["#f3f5f4", "#001a8f", "#002080", "#0033cc"], kind: "dark" },
  {
    tag: "light-gray-on-charcoa",
    colors: ["#e9eae9", "#25272e", "#36383d", "#4a4a4f"],
    kind: "dark",
  },
  { tag: "cream-on-black", colors: ["#f8f8e3", "#252325", "#393839", "#4d4d4d"], kind: "dark" },
  { tag: "orange-on-white", colors: ["#FF5F1F", "#ffffff", "#f5f5f5", "#E9E9E9"], kind: "light" },
  {
    tag: "orange-on-dark-gray",
    colors: ["#FF5F1F", "#333333", "#4d4d4d", "#666666"],
    kind: "dark",
  },
] as const

export type Scheme = (typeof schemes)[number]

export const getCurrentScheme = (settings: Settings, systemDarkMode: boolean) => {
  const selector = (() => {
    switch (settings.darkMode) {
      case "auto":
        return systemDarkMode ? "dark" : "light"
      case "on":
        return "dark"
      case "off":
        return "light"
    }
  })()

  const scheme = schemes.find((s) => s.tag === settings.colorScheme[selector])
  if (!scheme) {
    return schemes[0]
  }
  return scheme
}

const cssString = (colors: readonly [string, string, string, string]) => {
  return `
:root {
  --color-primary: ${colors[0]};
  --background-primary: ${colors[1]};
  --background-secondary: ${colors[2]};
  --background-tertiary: ${colors[3]};
}`
}

export const ColorStyleTag = () => {
  const settings = useStore((state) => state.settings)

  const systemDarkMode = useStore((state) => state.darkMode)

  const scheme = getCurrentScheme(settings, systemDarkMode)

  if (!scheme) {
    return null
  }

  return <style>{cssString(scheme.colors)}</style>
}

// ##################################################################### //
// ############################### Select ############################## //
// ##################################################################### //

type ColorDropdownProps = {
  schemes: readonly Scheme[]
  selectedScheme: string
  handleSchemeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const ColorDropdown = ({ schemes, selectedScheme, handleSchemeChange }: ColorDropdownProps) => (
  <select value={selectedScheme} onChange={handleSchemeChange}>
    {schemes.map((scheme) => (
      <option
        key={scheme.tag}
        value={scheme.tag}
        style={{
          backgroundColor: scheme.colors[1],
          color: scheme.colors[0],
        }}
      >
        {scheme.tag}
      </option>
    ))}
  </select>
)

export const ColorSchemeSelector = () => {
  const settings = useStore((state) => state.settings)

  const handleLightSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings((currentSettings) => ({
      ...currentSettings,
      colorScheme: {
        ...currentSettings.colorScheme,
        light: event.target.value,
      },
    }))
  }

  const handleDarkSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings((currentSettings) => ({
      ...currentSettings,
      colorScheme: {
        ...currentSettings.colorScheme,
        dark: event.target.value,
      },
    }))
  }

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings((currentSettings) => ({
      ...currentSettings,
      darkMode: event.target.value as "auto" | "on" | "off",
    }))
  }

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings((currentSettings) => ({
      ...currentSettings,
      theme: event.target.value as "future" | "space-craft" | "brutalist",
    }))
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Light scheme */}
      <label htmlFor="lightScheme">Light Scheme: </label>
      <ColorDropdown
        schemes={schemes.filter((s) => s.kind === "light")}
        selectedScheme={settings.colorScheme.light}
        handleSchemeChange={handleLightSchemeChange}
      />

      {/* Dark scheme */}
      <label htmlFor="darkScheme">Dark Scheme: </label>
      <ColorDropdown
        schemes={schemes.filter((s) => s.kind === "dark")}
        selectedScheme={settings.colorScheme.dark}
        handleSchemeChange={handleDarkSchemeChange}
      />

      {/* Dark mode */}
      <label htmlFor="darkMode">Dark Mode: </label>
      <select id="darkMode" value={settings.darkMode} onChange={handleDarkModeChange}>
        <option value="auto">Auto</option>
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>

      {/* Theme */}
      <label htmlFor="theme">Theme: </label>
      <select id="theme" value={settings.theme} onChange={handleThemeChange}>
        <option value="future">Future</option>
        <option value="space-craft">Space Craft</option>
        <option value="brutalist">Brutalist</option>
      </select>
    </div>
  )
}
