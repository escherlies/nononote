import { create } from "zustand"
import trpc, { Unsubscribable } from "./trcp"
import { logger } from "./logger"
import { View } from "./router"
import { Maybe } from "../../../shared/types"

// Store

export const useStore = create(() => ({
  error: null as Maybe<string>,
  counter: 0,
  noteInput: "",
  notes: [] as string[],
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

export const saveNote = () => {
  useStore.setState((state) => ({
    notes: [...state.notes, state.noteInput],
    noteInput: "",
  }))

  // Refocus on note-input
  const input = document.getElementById("note-input") as HTMLTextAreaElement
  input?.focus()
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

  const subscription = trpc.api.randomNumber.subscribe(undefined, {
    onStarted() {
      logger.debug("started")
    },
    onData(data) {
      // ^ note that `data` here is inferred
      logger.debug("received", data)
      useStore.setState({ testData: String(data.randomNumber) })
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
  logger.debug("setting view", view)
  useStore.setState({ view, menuOpen: false })
}

export const setSeachQuery = (query: string) => {
  useStore.setState({ searchQuery: query })
}

export const closeMenu = () => {
  useStore.setState({ menuOpen: false })
}
