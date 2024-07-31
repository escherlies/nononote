import { EventEmitter } from "node:events"

import { z } from "zod"

import { handleNotesMessages, notesMessages } from "./notes"
import { moduleLogger } from "./config"

const logger = moduleLogger("events")

// Message parser
export const message = notesMessages
export type Message = z.infer<typeof message>

const appMessageEvents = new EventEmitter()

export const listenForMessage = (
  cb: (message: Message) => void
): (() => void) => {
  logger.debug("Got a new subscriber")
  const wrappedCallback = (message: Message) => {
    try {
      cb(message)
    } catch (err) {
      logger.error("Error in subscriber callback: %o", err)
    }
  }
  appMessageEvents.on("message", wrappedCallback)
  return () => {
    logger.debug("Unsubscribing")
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
  logger.debug("Received message %o", message.type)
})
