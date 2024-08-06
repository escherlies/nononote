import { create } from "zustand"
import { logger } from "./logger"
import { navigateTo, View } from "./router"
import { Maybe } from "../../../shared/types"
import { Note } from "../../../server/src/data/note"
import { loadSettings, saveSettings, Settings } from "./settings"
import { monacoInstance } from "../view/components/Monaco"
import { User } from "../../../server/src/data/user"
import { sendMessage } from "./api"
import { storage } from "./storage"

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
  settings: loadSettings() as Settings,
  isMobile: window.innerWidth < 768,
  authToken: storage.getItem("auth-token"),
  user: null as Maybe<User>,
}))

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
  const user = useStore.getState().user
  if (!user) {
    return setError("User not found")
  }

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
    await sendMessage({ type: "notes:create", text: noteInput })
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
    await sendMessage({ type: "notes:update", id: noteId, text: noteInput })
  } catch (error) {
    cacheUpdatedNote(note)
    setError(String(error))
  }

  clearInput()
}

const cacheNewNote = (note: Note) => {
  useStore.setState((state) => {
    const unsyncedNewNotes = [note, ...state.unsyncedNewNotes]
    localStorage.setItem("unsyncedNewNotes", JSON.stringify(unsyncedNewNotes))
    return { unsyncedNewNotes: [note, ...state.unsyncedNewNotes] }
  })
}

const removeCachedNote = (noteId: string) => {
  useStore.setState((state) => {
    const unsyncedNewNotes = state.unsyncedNewNotes.filter((n) => n.id !== noteId)
    localStorage.setItem("unsyncedNewNotes", JSON.stringify(unsyncedNewNotes))
    return { unsyncedNewNotes }
  })
}

const cacheUpdatedNote = (note: Note) => {
  useStore.setState((state) => {
    const unsyncedUpdatedNotes = [note, ...state.unsyncedUpdatedNotes]
    localStorage.setItem("unsyncedUpdatedNotes", JSON.stringify(unsyncedUpdatedNotes))
    return { unsyncedUpdatedNotes }
  })
}

const removeCachedUpdatedNote = (noteId: string) => {
  useStore.setState((state) => {
    const unsyncedUpdatedNotes = state.unsyncedUpdatedNotes.filter((n) => n.id !== noteId)
    localStorage.setItem("unsyncedUpdatedNotes", JSON.stringify(unsyncedUpdatedNotes))
    return { unsyncedUpdatedNotes }
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

// export const startSubscription = async (authToken: string) => {
//   console.log("Starting subscription...")

//   const existingSubscription = useStore.getState().testSubscription
//   if (existingSubscription) {
//     return
//   }

//   const subscription = trpc.api.notes.subscribe(
//     { authToken: authToken },
//     {
//       onStarted() {
//         logger.debug("started")

//         // Fetch all notes
//         trpc.api.message.mutate({ type: "notes:fetch:all" }).catch((error) => {
//           setError(String(error))
//         })
//       },
//       onData(data) {
//         logger.debug("data", data)
//         switch (data.type) {
//           case "notes:note":
//             useStore.setState((state) => {
//               const updatedNotes = state.notes.filter((note) => note.id !== data.note.id)
//               return { notes: [data.note, ...updatedNotes] }
//             })
//             break

//           case "notes:got-notes": {
//             useStore.setState((state) => {
//               const updatedNotes = state.notes.filter(
//                 (note) => !data.notes.some((n) => n.id === note.id)
//               )
//               return { notes: [...data.notes, ...updatedNotes] }
//             })
//             break
//           }

//           default:
//             break
//         }
//       },
//       onError(err) {
//         logger.error("error", err)
//       },
//       onComplete() {
//         logger.debug("completed")
//       },
//       onStopped() {
//         logger.debug("stopped")
//       },
//     }
//   )

//   useStore.setState({ testSubscription: subscription })
// }

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

export const toggleDarkMode = () => {
  useStore.setState((state) => ({ darkMode: !state.darkMode }))
}

export const loadUnsyncedNewNotes = () => {
  const unsyncedNewNotes = localStorage.getItem("unsyncedNewNotes")
  if (unsyncedNewNotes) {
    useStore.setState({ unsyncedNewNotes: JSON.parse(unsyncedNewNotes) })
  }
}

export const attemptSyncNotes = async () => {
  const unsyncedNewNotes = useStore.getState().unsyncedNewNotes

  // Attempt to sync new notes
  for await (const note of unsyncedNewNotes) {
    try {
      await sendMessage({ type: "notes:create", text: note.text })
      removeCachedNote(note.id)
    } catch (error) {
      setError(String(error))
    }
  }

  // Attempt to sync updated notes
  const unsyncedUpdatedNotes = useStore.getState().unsyncedUpdatedNotes
  for await (const note of unsyncedUpdatedNotes) {
    try {
      await sendMessage({ type: "notes:update", id: note.id, text: note.text })
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
