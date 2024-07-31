import { EventEmitter } from "node:events"

import { z } from "zod"

import { handleNotesMessages, notesMessages } from "./notes"

// Message parser
export const message = notesMessages
export type Message = z.infer<typeof message>

const appMessageEvents = new EventEmitter()

export const listenForMessage = (
  cb: (message: Message) => void
): (() => void) => {
  console.log("subscribing")
  const wrappedCallback = (message: Message) => {
    try {
      cb(message)
    } catch (err) {
      console.error("Error in subscriber callback:", err)
    }
  }
  appMessageEvents.on("message", wrappedCallback)
  return () => {
    console.log("unsubscribing")
    appMessageEvents.off("message", wrappedCallback)
  }
}

export const emitMessageEvent = (message: Message) => {
  appMessageEvents.emit("message", message)
}

// Subscriber

listenForMessage((message) => {
  void handleNotesMessages(message)
})

// Debug subscriber
listenForMessage((message) => {
  console.log("on:", message.type)
})
