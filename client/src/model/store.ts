import { create } from "zustand"
import { logger } from "./logger"
import { navigateTo, View } from "./router"
import { Maybe } from "../../../shared/types"
import { Note } from "../../../server/src/data/note"
import { defaultSettings, loadSettings, saveSettings, Settings } from "./settings"
import { monacoInstance } from "../view/components/Monaco"
import { User } from "../../../server/src/data/user"
import { publish } from "./api"
import { storage } from "./storage"
import { initializeWebSocket } from "./websocket"
import { getUserDarkModePreference } from "../view/views/settings/Color"
import { Modal } from "../view/Modal"

// Store

export const useStore = create(() => ({
  error: null as Maybe<string>,
  counter: 0,
  noteInput: "",
  notes: [] as Note[],
  menuOpen: false,
  view: { tag: "Home" } as View,
  darkMode: false,
  searchQuery: "",
  isConnected: false,
  unsyncedNewNotes: [] as Note[],
  unsyncedUpdatedNotes: [] as Note[],
  unsyncedDeletedNotes: [] as string[],
  settings: loadSettings() as Settings,
  isMobile: window.innerWidth < 768,
  authToken: null as Maybe<string>,
  user: null as Maybe<User>,
  connection: null as Maybe<WebSocket>,
  modal: null as Maybe<Modal>,
  reconnectionAttempts: 0,
}))

// Subscriptions

useStore.subscribe((state) => {
  const selector = getUserDarkModePreference(state.settings, state.darkMode)
  document.body.classList.toggle("dark", selector === "dark")
})

// Actions/Reducers

export const setError = (error: Maybe<string>) => {
  useStore.setState({ error })
}

export const incrementCounter = () => {
  useStore.setState((state) => ({ counter: state.counter + 1 }))
}

export const decrementCounter = () => {
  useStore.setState((state) => ({ counter: state.counter - 1 }))
}

export const setNoteInput = (noteInput: string) => {
  useStore.setState({ noteInput })
}

export const saveNote = async () => {
  const view = useStore.getState().view
  switch (view.tag) {
    case "Home":
      return saveNewNote()
    case "EditNote":
      return updateNote(view.id).then(() => navigateTo({ tag: "Note", id: view.id }))
    default:
      return
  }
}

export const saveNewNote = async () => {
  const noteInput = useStore.getState().noteInput.trim()
  const isConnected = useStore.getState().isConnected

  if (!noteInput) {
    return
  }

  const note: Note = {
    id: "tmp_" + String(new Date().valueOf()),
    text: noteInput,
    tags: [],
    categories: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!isConnected) {
    cacheNewNote(note)
    clearInput()
    return
  }

  try {
    await publish({ type: "notes:create", text: noteInput })
  } catch (error) {
    cacheNewNote(note)
    setError(String(error))
  }

  clearInput()
}

export const updateNote = async (noteId: string) => {
  const noteInput = useStore.getState().noteInput.trim()
  const isConnected = useStore.getState().isConnected

  if (!noteInput) {
    return
  }

  const note: Omit<Note, "userId"> = {
    id: noteId,
    text: noteInput,
    tags: [],
    categories: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (!isConnected) {
    cacheUpdatedNote(note)
    clearInput()
    return
  }

  try {
    await publish({ type: "notes:update", id: noteId, text: noteInput })
  } catch (error) {
    cacheUpdatedNote(note)
    setError(String(error))
  }

  clearInput()
}

export const deleteNote = async (noteId: string) => {
  const isConnected = useStore.getState().isConnected

  if (!isConnected) {
    cacheDeletedNote(noteId)
    return
  }

  try {
    await publish({ type: "notes:delete", id: noteId })
  } catch (error) {
    setError(String(error))
  }
}

const cacheNewNote = (note: Note) => {
  useStore.setState((state) => {
    const unsyncedNewNotes = [note, ...state.unsyncedNewNotes]
    storage.setItem("unsyncedNewNotes", JSON.stringify(unsyncedNewNotes))
    return { unsyncedNewNotes: [note, ...state.unsyncedNewNotes] }
  })
}

const removeCachedNote = (noteId: string) => {
  useStore.setState((state) => {
    const unsyncedNewNotes = state.unsyncedNewNotes.filter((n) => n.id !== noteId)
    storage.setItem("unsyncedNewNotes", JSON.stringify(unsyncedNewNotes))
    return { unsyncedNewNotes }
  })
}

const cacheUpdatedNote = (note: Note) => {
  useStore.setState((state) => {
    const unsyncedUpdatedNotes = [note, ...state.unsyncedUpdatedNotes]
    storage.setItem("unsyncedUpdatedNotes", JSON.stringify(unsyncedUpdatedNotes))
    return { unsyncedUpdatedNotes }
  })
}

const removeCachedUpdatedNote = (noteId: string) => {
  useStore.setState((state) => {
    const unsyncedUpdatedNotes = state.unsyncedUpdatedNotes.filter((n) => n.id !== noteId)
    storage.setItem("unsyncedUpdatedNotes", JSON.stringify(unsyncedUpdatedNotes))
    return { unsyncedUpdatedNotes }
  })
}

const cacheDeletedNote = (noteId: string) => {
  useStore.setState((state) => {
    const unsyncedDeletedNotes = [noteId, ...state.unsyncedDeletedNotes]
    storage.setItem("unsyncedDeletedNotes", JSON.stringify(unsyncedDeletedNotes))
    return { unsyncedDeletedNotes }
  })
}

export const removeCachedDeletedNote = (noteId: string) => {
  useStore.setState((state) => {
    const unsyncedDeletedNotes = state.unsyncedDeletedNotes.filter((n) => n !== noteId)
    storage.setItem("unsyncedDeletedNotes", JSON.stringify(unsyncedDeletedNotes))
    return { unsyncedDeletedNotes }
  })
}

export const clearInput = () => {
  useStore.setState({ noteInput: "" })
  const input = document.getElementById("note-input") as HTMLTextAreaElement
  input?.focus()

  monacoInstance?.editor.getEditors()[0]?.focus()
}

export const toggleMenu = () => {
  useStore.setState((state) => ({ menuOpen: !state.menuOpen }))
}

export const setView = (view: View) => {
  useStore.setState({ view, menuOpen: false })
}

export const setSeachQuery = (query: string) => {
  useStore.setState({ searchQuery: query })
  window.history.replaceState({ q: query }, "", "/search?q=" + query)
}

export const clearSearchQuery = () => {
  useStore.setState({ searchQuery: "" })
  window.history.pushState({ q: "" }, "", "/search?q=" + "")
}

export const closeMenu = () => {
  useStore.setState({ menuOpen: false })
}

export const setConnectionStatus = (isConnected: boolean) => {
  useStore.setState({ isConnected })
}

export const toggleDarkMode = (darkMode: boolean) => {
  useStore.setState((state) => ({ darkMode: darkMode }))
}

export const loadUnsyncedNewNotes = () => {
  const unsyncedNewNotes = storage.getItem("unsyncedNewNotes")
  if (unsyncedNewNotes) {
    useStore.setState({ unsyncedNewNotes: JSON.parse(unsyncedNewNotes) })
  }
}

export const attemptSyncNotes = async () => {
  const unsyncedNewNotes = useStore.getState().unsyncedNewNotes

  // Attempt to sync new notes
  for await (const note of unsyncedNewNotes) {
    try {
      await publish({ type: "notes:create", text: note.text })
      removeCachedNote(note.id)
    } catch (error) {
      setError(String(error))
    }
  }

  // Attempt to sync updated notes
  const unsyncedUpdatedNotes = useStore.getState().unsyncedUpdatedNotes
  for await (const note of unsyncedUpdatedNotes) {
    try {
      await publish({ type: "notes:update", id: note.id, text: note.text })
      removeCachedUpdatedNote(note.id)
    } catch (error) {
      setError(String(error))
    }
  }
}

export const updateSettings = (fn: (settings: Settings) => Settings) => {
  useStore.setState((state) => {
    const settings = fn(state.settings)
    saveSettings(settings)
    return { settings }
  })
}

export const initEditNote = (noteId: string) => {
  const note = useStore.getState().notes.find((n) => n.id === noteId)
  if (!note) {
    logger.error("Note not found")
    return setError("Note not found")
  }

  setNoteInput(note.text)
}

export const handleAuth = (authToken: string) => {
  useStore.setState({ authToken })
  storage.setItem("auth-token", authToken)

  // Init websockets
  initializeWebSocket(authToken)
}

export const handleAuthError = (error: string) => {
  useStore.setState({ error })
  logOut()
}

export const logOut = () => {
  useStore.setState({ authToken: null })
  storage.removeItem("auth-token")

  // Reset settings
  updateSettings(() => defaultSettings)
}

export const setConnection = (connection: WebSocket) => {
  useStore.setState({ connection })
  useStore.setState({ isConnected: true })
  useStore.setState({ reconnectionAttempts: 0 })
}

export const onSubscriptionReady = () => {
  attemptSyncNotes()
  publish({ type: "notes:fetch:all" })
}

export const removeConnection = () => {
  useStore.setState({ connection: null })
  useStore.setState({ isConnected: false })
}

export const setModal = (modal: Maybe<Modal>) => {
  useStore.setState({ modal })
}

export const handleDeleteNote = (noteId: string) => {
  deleteNote(noteId)
  setModal(null)
  // Navigate to notes
  navigateTo({ tag: "Notes" })
}
