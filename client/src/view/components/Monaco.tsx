import { MainButton } from "../Ui"
import Editor, { useMonaco } from "@monaco-editor/react"
import { KeyCode, KeyMod } from "monaco-editor"
import { useEffect } from "react"

export function ViewMonaco() {
  const monaco = useMonaco()

  useEffect(() => {
    if (!monaco?.editor) {
      return
    }

    const editor = monaco.editor

    monaco.editor.defineTheme("transparentTheme", {
      base: "hc-light", // Can be 'vs', 'vs-dark', or 'hc-black'
      inherit: false, // Inherit from the base theme
      rules: [], // No custom rules
      colors: {
        "editor.foreground": "#001AFF", // Text color
        "editorCursor.foreground": "#001AFF", // Cursor color
        "editor.selectionBackground": "#001AFF", // Selection color
        "editor.selectionForeground": "#FFFFFF", // White selection foreground
        "scrollbarSlider.background": "#001AFF", // Scrollbar
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

    monaco.editor.setTheme("transparentTheme")

    editor.addKeybindingRules([
      { keybinding: KeyCode.F1, command: null }, // disable show command center
      { keybinding: KeyMod.WinCtrl | KeyCode.Space, command: null }, // Disable Ctrl + Space for suggestions
      { keybinding: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC, command: null }, // Disable Cmd+Alt+C for toggle case
      { keybinding: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR, command: null }, // Disable Cmd+Alt+R for toggle regex
      { keybinding: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyW, command: null }, // Disable Cmd+Alt+W for toggle whole word
    ])
  }, [monaco])

  return (
    <Editor
      height="50vh"
      width="50vw"
      defaultLanguage="plaintext"
      defaultValue={sampleText}
      onMount={(editor, monaco) => {
        console.log("editor mounted")
        // Focus the editor
        editor.focus()
      }}
      options={{
        language: "markdown",
        lineNumbers: "off", // Disable line numbers
        roundedSelection: false, // Disable rounded selection
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
        fontSize: 14, // Set custom font size
        "semanticHighlighting.enabled": false, // Disable semantic highlighting
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
      }}
    />
  )
}

const sampleText = `
### Incident Report UX/UI-02
**Date:** [REDACTED]

**Description:** During today's session, one subject reported a phenomenon where clicking a button on the prototype caused their surroundings to blur and warp. The distortion lasted approximately 15 seconds, during which the subject claimed to experience vivid, fragmented memories of past events that they had no prior recollection of. Post-event analysis of the prototype revealed no immediate anomalies in the code. Further testing is necessary to determine the source of these disturbances.

### Incident Report UX/UI-03
**Date:** [REDACTED]

**Description:** Another anomaly was observed today. Subjects engaging with a specific section of the interface reported auditory hallucinations. These hallucinations ranged from faint whispers to full conversations in an unknown language. Subjects described these sounds as both unsettling and familiar, though none could articulate why. Sound recordings during the sessions detected no external noises, suggesting an internal cognitive or perceptual anomaly.

### Incident Report UX/UI-04
**Date:** [REDACTED]

**Description:** A significant incident occurred when a subject attempted to submit a form within the prototype. Upon clicking the 'Submit' button, the subject experienced a sensation of being pulled into the screen, followed by a complete loss of spatial awareness. The subject reported feeling like they were floating in a void for an indeterminate amount of time. External observation showed the subject in a catatonic state for 3 minutes. The form submission action did not register in the system logs.

### Incident Report UX/UI-05
**Date:** [REDACTED]

**Description:** During a routine usability test, multiple subjects reported seeing shadowy figures moving in their peripheral vision when focusing on certain design elements. These figures disappeared when looked at directly. Environmental checks confirmed no one else was present in the testing area. Psychological evaluations of the subjects showed elevated stress levels and mild paranoia after the sessions, warranting further scrutiny into the prototype's visual stimuli.

### Incident Report UX/UI-06
**Date:** [REDACTED]

**Description:** In an unprecedented event, one subject disappeared from the testing lab for a period of 5 minutes. Surveillance footage showed the subject interacting with the prototype, then vanishing instantaneously. The subject reappeared at the exact same spot 5 minutes later, with no memory of the event or awareness that any time had passed. Their session logs during the missing period showed no interruptions or anomalies.

### Incident Report UX/UI-07
**Date:** [REDACTED]

**Description:** A peculiar incident involved a subject who reported an out-of-body experience while navigating the prototype. The subject described seeing themselves from a third-person perspective, observing their actions as if from a few feet away. This dissociation lasted for about 2 minutes, during which the subject’s biometric readings showed normal physical activity but heightened brainwave patterns typical of intense focus or stress. The prototype did not log any unusual activity during this time.
`
