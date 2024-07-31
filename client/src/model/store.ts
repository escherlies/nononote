import { create } from "zustand"
import trpc, { Unsubscribable } from "./trcp"
import { logger } from "./logger"
import { View } from "./router"
import { Maybe } from "../../../shared/types"
import { Note } from "../../../server/src/data"

// Store

export const useStore = create(() => ({
  error: null as Maybe<string>,
  counter: 0,
  noteInput: "",
  notes: [] as Note[],
  testData: null as Maybe<string>,
  testSubscription: null as Maybe<Unsubscribable>,
  menuOpen: false,
  view: { tag: "Home" } as View,
  darkMode: false,
  searchQuery: "",
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
  const noteInput = useStore.getState().noteInput

  if (!noteInput) {
    return
  }

  try {
    await trpc.api.message.mutate({ type: "note:create", text: noteInput })
    useStore.setState({ noteInput: "" })

    // Refocus on note-input
    const input = document.getElementById("note-input") as HTMLTextAreaElement
    input?.focus()
  } catch (error) {
    setError(String(error))
    // Save noteInput to localStorage
    const date = new Date().toISOString()
    localStorage.setItem(`noteInput-${date}`, noteInput)
    // todo: add recovery mechanism
  }
}

export const toggleMenu = () => {
  useStore.setState((state) => ({ menuOpen: !state.menuOpen }))
}

export const getTestData = async () => {
  const result = await trpc.api.hello.mutate("World")
  logger.debug(result)
  useStore.setState({ testData: result })
}

export const startSubscription = async () => {
  const existingSubscription = useStore.getState().testSubscription
  if (existingSubscription) {
    return
  }

  const subscription = trpc.api.notes.subscribe(undefined, {
    onStarted() {
      logger.debug("started")
    },
    onData(data) {
      logger.debug("data", data)
      switch (data.type) {
        case "note:note":
          useStore.setState((state) => {
            const updatedNotes = state.notes.filter((note) => note.id !== data.note.id)
            return { notes: [data.note, ...updatedNotes] }
          })
          break

        default:
          break
      }
    },
    onError(err) {
      logger.error("error", err)
    },
    onComplete() {
      logger.debug("completed")
    },
  })

  useStore.setState({ testSubscription: subscription })
}

export const stopSubscription = () => {
  const subscription = useStore.getState().testSubscription
  if (subscription) {
    subscription.unsubscribe()
    useStore.setState({ testSubscription: null })
  }
}

export const setView = (view: View) => {
  useStore.setState({ view, menuOpen: false })
}

export const setSeachQuery = (query: string) => {
  useStore.setState({ searchQuery: query })
  window.history.replaceState({ q: query }, "", "/search?q=" + query)
}

export const closeMenu = () => {
  useStore.setState({ menuOpen: false })
}
