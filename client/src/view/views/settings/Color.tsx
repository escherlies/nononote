/* eslint-disable @typescript-eslint/no-unused-vars */
import { updateSettings, useStore } from "../../../model/store"
import { Settings } from "../../../model/settings"

const schemes = [
  {
    tag: "blue-on-white",
    colors: {
      colorAccent: "#001aff",
      backgroundPrimary: "#fffefd",
      backgroundSecondary: "#f2f2f2",
      backgroundTertiary: "#e6e6e6",
      colorTextPrimary: "#001a1a",
    },
    kind: "light",
  },
  {
    tag: "blue-on-night",
    colors: {
      colorAccent: "#001aff",
      backgroundPrimary: "#0D0A0B",
      backgroundSecondary: "#121112",
      backgroundTertiary: "#0D0A0B",
      colorTextPrimary: "#d9d9d9",
    },
    kind: "dark",
  },
  {
    tag: "light-gray-on-white",
    colors: {
      colorAccent: "#25272e",
      backgroundPrimary: "#f2f2f2",
      backgroundSecondary: "#e9eae9",
      backgroundTertiary: "#d9d9d9",
      colorTextPrimary: "#25272e",
    },
    kind: "light",
  },
  {
    tag: "light-gray-on-night",
    colors: {
      colorAccent: "#e9eae9",
      backgroundPrimary: "#0D0A0B",
      backgroundSecondary: "#110E0F",
      backgroundTertiary: "#0D0A0B",
      colorTextPrimary: "#d9d9d9",
    },
    kind: "dark",
  },
  {
    tag: "orange-on-white",
    colors: {
      colorAccent: "#FF5F1F",
      backgroundPrimary: "#ffffff",
      backgroundSecondary: "#f5f5f5",
      backgroundTertiary: "#E9E9E9",
      colorTextPrimary: "#1E1E1E",
    },
    kind: "light",
  },
  {
    tag: "orange-on-night",
    colors: {
      colorAccent: "#FF5F1F",
      backgroundPrimary: "#0D0A0B",
      backgroundSecondary: "#110E0F",
      backgroundTertiary: "#0D0A0B",
      colorTextPrimary: "#d9d9d9",
    },
    kind: "dark",
  },
] as const

export type Scheme = (typeof schemes)[number]
export type ColorScheme = Scheme["colors"]

export const getUserDarkModePreference = (settings: Settings, systemDarkMode: boolean) => {
  switch (settings.darkMode) {
    case "auto":
      return systemDarkMode ? "dark" : "light"
    case "on":
      return "dark"
    case "off":
      return "light"
  }
}

export const getCurrentScheme = (settings: Settings, systemDarkMode: boolean) => {
  const selector = getUserDarkModePreference(settings, systemDarkMode)

  const scheme = schemes.find((s) => s.tag === settings.colorScheme[selector])
  if (!scheme) {
    return schemes[0]
  }
  return scheme
}

const cssString = (colors: ColorScheme) => {
  return `
:root {
  --color-accent: ${colors.colorAccent};
  --background-primary: ${colors.backgroundPrimary};
  --background-secondary: ${colors.backgroundSecondary};
  --background-tertiary: ${colors.backgroundTertiary};
  --color-text-primary: ${colors.colorTextPrimary};
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
  <select
    value={selectedScheme}
    onChange={handleSchemeChange}
    className="text-sm text-center h-8 rounded px-4 py-1"
  >
    {schemes.map((scheme) => (
      <option
        key={scheme.tag}
        value={scheme.tag}
        style={{
          backgroundColor: scheme.colors.backgroundPrimary,
          color: scheme.colors.colorTextPrimary,
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
      theme: event.target.value as "modern" | "space-craft" | "brutalist",
    }))
  }

  const handleButttonSoundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings((currentSettings) => ({
      ...currentSettings,
      buttonSound: event.target.value === "true",
    }))
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-full items-center">
      {/* Light scheme */}
      {/* <label htmlFor="lightScheme">Light Scheme: </label>
      <ColorDropdown
        schemes={schemes.filter((s) => s.kind === "light")}
        selectedScheme={settings.colorScheme.light}
        handleSchemeChange={handleLightSchemeChange}
      /> */}

      {/* Dark scheme */}
      {/* <label htmlFor="darkScheme">Dark Scheme: </label>
      <ColorDropdown
        schemes={schemes.filter((s) => s.kind === "dark")}
        selectedScheme={settings.colorScheme.dark}
        handleSchemeChange={handleDarkSchemeChange}
      /> */}

      {/* Dark mode */}
      <label htmlFor="darkMode">Dark Mode</label>
      <select
        id="darkMode"
        value={settings.darkMode}
        onChange={handleDarkModeChange}
        className="text-sm text-center h-8 rounded px-4 py-1"
      >
        <option value="auto">Auto</option>
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>

      {/* Theme */}
      {/* <label htmlFor="theme">Theme: </label>
      <select
        id="theme"
        value={settings.theme}
        onChange={handleThemeChange}
        className="text-sm text-center h-8 rounded px-4 py-1"
      >
        <option value="modern">Modern</option>
        <option value="space-craft">Space Craft</option>
        <option value="brutalist">Brutalist</option>
      </select> */}

      {/* Button Sounds */}
      {/* <label htmlFor="buttonSound">
        Button Sounds <br />
        <span className="text-xs">(Brutalist Theme only): </span>
      </label>
      <select
        id="buttonSound"
        value={String(settings.buttonSound)}
        onChange={handleButttonSoundChange}
        className="text-sm text-center h-8 rounded px-4 py-1"
      >
        <option value="true">On</option>
        <option value="false">Off</option>
      </select> */}
    </div>
  )
}
