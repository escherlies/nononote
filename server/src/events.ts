import { EventEmitter } from "node:events"

import { z } from "zod"

import { handleNotesMessages, notesMessages } from "./notes"
import { moduleLogger } from "./config"
import { Maybe } from "../../shared/types"

const logger = moduleLogger("events")

export type Message = z.infer<typeof notesMessages>

const appMessageEvents = new EventEmitter()

export type MessageWithContext = {
  message: Message
  context: {
    user: Maybe<{ id: string }>
  }
}

export const listenForMessage = (cb: (messageEvt: MessageWithContext) => void): (() => void) => {
  logger.debug("Got a new subscriber")
  const wrappedCallback = (message: MessageWithContext) => {
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

export const emitMessageEvent = (messageWithContext: MessageWithContext) => {
  appMessageEvents.emit("message", messageWithContext)
}

// Subscriber

listenForMessage((messageWithContext) => {
  void handleNotesMessages(messageWithContext)
})

// Debug subscriber
listenForMessage((messageWithContext) => {
  logger.debug("Received message %o", messageWithContext.message.type)
})
