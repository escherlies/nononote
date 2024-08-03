import { updateSettings, useStore } from "../../../model/store"
import { Settings } from "../../../model/settings"

const schemes = [
  { tag: "blue-on-gray", colors: ["#001aff", "#dbdbdb"], kind: "light" },
  { tag: "blue-on-white", colors: ["#001aff", "#fffefd"], kind: "light" },
  { tag: "teal-on-pale-blue", colors: ["#1b2c2e", "#f7fbfc"], kind: "light" },
  { tag: "white-on-blue", colors: ["#f3f5f4", "#001a8f"], kind: "dark" },
  { tag: "light-gray-on-charcoa", colors: ["#e9eae9", "#25272e"], kind: "dark" },
  { tag: "cream-on-black", colors: ["#f8f8e3", "#252325"], kind: "dark" },
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

  const scheme = schemes.find((s) => s.tag === settings.theme[selector])
  if (!scheme) {
    return schemes[0]
  }
  return scheme
}

const cssString = (colors: readonly [string, string]) => {
  return `
:root {
  --color-primary: ${colors[0]};
  --background-primary: ${colors[1]};
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
      theme: {
        ...currentSettings.theme,
        light: event.target.value,
      },
    }))
  }

  const handleDarkSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings((currentSettings) => ({
      ...currentSettings,
      theme: {
        ...currentSettings.theme,
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

  return (
    <div className="grid grid-cols-2 gap-4">
      <label htmlFor="lightScheme">Light Scheme: </label>
      <ColorDropdown
        schemes={schemes.filter((s) => s.kind === "light")}
        selectedScheme={settings.theme.light}
        handleSchemeChange={handleLightSchemeChange}
      />
      {/* <div
          style={{
            backgroundColor: schemes.find((s) => s.tag === lightScheme)!.colors[1],
            color: schemes.find((s) => s.tag === lightScheme)!.colors[0],
          }}
        >
          Light Scheme Preview
        </div> */}
      <label htmlFor="darkScheme">Dark Scheme: </label>
      <ColorDropdown
        schemes={schemes.filter((s) => s.kind === "dark")}
        selectedScheme={settings.theme.dark}
        handleSchemeChange={handleDarkSchemeChange}
      />
      {/* <div
          style={{
            backgroundColor: schemes.find((s) => s.tag === darkScheme)!.colors[1],
            color: schemes.find((s) => s.tag === darkScheme)!.colors[0],
          }}
        >
          Dark Scheme Preview
        </div> */}
      <label htmlFor="darkMode">Dark Mode: </label>
      <select id="darkMode" value={settings.darkMode} onChange={handleDarkModeChange}>
        <option value="auto">Auto</option>
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
    </div>
  )
}
