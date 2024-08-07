import { EventEmitter } from "node:events"

import { z } from "zod"

import { moduleLogger } from "./config"
import { Maybe } from "../../shared/types"
import { AppMsg } from "./messages"
import { handleNotesMessages } from "./notes"

const logger = moduleLogger("events")

const appMessageEvents = new EventEmitter()

export type MessageWithContext = {
  message: AppMsg
  context: {
    user: Maybe<{ id: string }>
  }
}

export const listenForMessage = (cb: (messageEvt: MessageWithContext) => void): (() => void) => {
  logger.debug("Got a new subscriber.")
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
