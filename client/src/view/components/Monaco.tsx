import Editor, { Monaco, loader } from "@monaco-editor/react"
import * as monaco from "monaco-editor"
import { setNoteInput, useStore } from "../../model/store"
import { getCurrentScheme, Scheme } from "../views/settings/Color"
import { KeyCode, KeyMod } from "monaco-editor"
import { useState } from "react"

loader.config({ monaco })

export let monacoInstance: Monaco | null = null

loader.init().then((monaco) => {
  monacoInstance = monaco
})

export function ViewMonaco() {
  const noteInput = useStore((state) => state.noteInput)
  const systemDarkMode = useStore((state) => state.darkMode)
  const settings = useStore((state) => state.settings)

  const [hasFocus, setHasFocus] = useState(false)

  const scheme = getCurrentScheme(settings, systemDarkMode)

  return (
    <div className="w-full h-full relative">
      <Editor
        key="editor"
        height="100%"
        width="100%"
        defaultLanguage="markdown"
        options={options}
        beforeMount={setMonacoThemeAndKeybindings(scheme)}
        onMount={(editor, monaco) => {
          monaco.editor.setTheme(`nnn-${scheme.tag}`)
          editor.focus()
          editor.onDidFocusEditorText(() => setHasFocus(true))
          editor.onDidBlurEditorText(() => setHasFocus(false))
        }}
        loading={<div></div>} // Disable loading spinner
        value={noteInput}
        onChange={(value) => {
          setNoteInput(value ?? "")
        }}
      />
      {!hasFocus && noteInput === "" && (
        <div className="absolute inset-0 opacity-50 pointer-events-none">New note...</div>
      )}
    </div>
  )
}

const setMonacoThemeAndKeybindings = (scheme: Scheme) => (monaco: Monaco) => {
  const [primary, background] = scheme.colors

  monaco.editor.defineTheme(`nnn-${scheme.tag}`, {
    base: "hc-light", // Can be 'vs', 'vs-dark', or 'hc-black'
    inherit: false, // Inherit from the base theme
    rules: [], // No custom rules
    colors: {
      "editor.foreground": primary, // Text color
      "editorCursor.foreground": primary, // Cursor color
      "editor.selectionBackground": primary, // Selection color
      "editor.selectionForeground": scheme.kind === "light" ? "#FFFFFF" : background, // White selection foreground
      "scrollbarSlider.background": primary, // Scrollbar
      // The following colors are set to fully transparent
      "editor.background": "#00000000", // Fully transparent background
      "editor.lineHighlightBackground": "#00000000", // Transparent line highlight
      "editorLineNumber.foreground": "#00000000", // Transparent line numbers
      "editor.inactiveSelectionBackground": "#00000000", // Transparent inactive selection background
      "editorIndentGuide.background": "#00000000", // Transparent indent guide
      "editorIndentGuide.activeBackground": "#00000000", // Transparent active indent guide
      "editorWhitespace.foreground": "#00000000", // Transparent whitespace
      // Transparent word highlights
      "editor.wordHighlightBackground": "#00000000",
      "editor.wordHighlightStrongBackground": "#00000000",
      // Disable focus border
      "editorWidget.border": "#00000000",
      focusBorder: "#00000000", // Transparent border
    },
  })

  monaco.editor.addKeybindingRules([
    { keybinding: KeyCode.F1, command: null }, // disable show command center
    { keybinding: KeyMod.WinCtrl | KeyCode.Space, command: null }, // Disable Ctrl + Space for suggestions
    { keybinding: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC, command: null }, // Disable Cmd+Alt+C for toggle case
    { keybinding: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR, command: null }, // Disable Cmd+Alt+R for toggle regex
    { keybinding: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyW, command: null }, // Disable Cmd+Alt+W for toggle whole word
  ])
}

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
  language: "markdown",
  lineNumbers: "off", // Disable line numbers
  roundedSelection: false, // Disable rounded-lg selection
  scrollBeyondLastLine: false, // Disable scrolling beyond the last line
  minimap: { enabled: false }, // Disable minimap
  glyphMargin: false, // Disable glyph margin
  folding: false, // Disable folding
  smoothScrolling: false, // Disable smooth scrolling
  contextmenu: false, // Disable context menu
  automaticLayout: true, // Enable automatic layout
  scrollbar: {
    vertical: "auto", // Disable vertical scrollbar
    horizontal: "hidden", // Disable horizontal scrollbar
  },
  wordWrap: "on", // Enable word wrap
  overviewRulerLanes: 0, // Disable overview ruler lanes
  hideCursorInOverviewRuler: true, // Hide cursor in overview ruler
  renderLineHighlight: "none", // Disable line highlight
  // renderWhitespace: "none", // ! Disable whitespace rendering
  matchBrackets: "never", // Disable bracket matching
  lineDecorationsWidth: 0, // Set line decorations width to 0
  lineNumbersMinChars: 0, // Set minimum characters for line numbers to 0
  fontFamily: "Inter, sans-serif", // ! Set custom font family
  wrappingStrategy: "advanced", // ! If a custom font family is set, use "advanced" wrapping strategy
  // theme: "transparent", // Set custom theme
  fontSize: 22, // Set custom font size
  "semanticHighlighting.enabled": true, // Disable semantic highlighting
  // selectionHighlight: false, // Disable selection highlighting
  // // Disable suggestions
  suggestOnTriggerCharacters: false,
  quickSuggestions: false,
  tabCompletion: "off",
  // suggest: {
  //   showStatusBar: false,
  //   filterGraceful: false,
  //   preview: false,
  // },
  value: "",
  // language: "plaintext", // Set language to plaintext to avoid syntax highlighting
  codeLens: false, // Disable code lens
  hover: {
    enabled: false,
  }, // Disable hover
  selectionHighlight: false, // Disable selection highlight
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "never",
    seedSearchStringFromSelection: "selection",
  }, // Disable find widget options
  parameterHints: { enabled: false }, // Disable parameter hints
  formatOnType: false, // Disable format on type
  formatOnPaste: false, // Disable format on paste
  occurrencesHighlight: "off", // Disable occurrences highlight
  foldingHighlight: false, // Disable folding highlight
  showFoldingControls: "never", // Never show folding controls
  renderFinalNewline: "on", // Disable rendering of final newline
  copyWithSyntaxHighlighting: false, // Disable copying with syntax highlighting
  dragAndDrop: true, // Disable drag and drop
  // fontLigatures: true, // Disable font ligatures
}
