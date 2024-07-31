import ws from "ws"
import { z } from "zod"

import { createHTTPServer } from "@trpc/server/adapters/standalone"
import { observable, Unsubscribable } from "@trpc/server/observable"
import { applyWSSHandler } from "@trpc/server/adapters/ws"

import { publicProcedure, router } from "./trpc"
import { message, Message, emitMessageEvent, listenForMessage } from "./events"
import { moduleLogger } from "./config"

const logger = moduleLogger("trpc")

const appRouter1 = router({
  hello: publicProcedure
    .input(z.string())
    .output(z.string())
    .mutation(async ({ input }) => {
      return `Hello, ${input}!`
    }),
  message: publicProcedure.input(message).mutation(async (opts) => {
    const { input } = opts
    emitMessageEvent(input)
  }),
  notes: publicProcedure.subscription(() => {
    return observable<Message>((emit) => {
      emit.next({ type: "noop" })

      const unsub = listenForMessage((message) => {
        const clientMsgs: Message["type"][] = ["notes:note", "notes:got-notes"]
        if (clientMsgs.includes(message.type)) {
          emit.next(message)
        }
      })
      return unsub
    })
  }),
})

const appRouter = router({
  api: appRouter1,
})

const server = createHTTPServer({
  router: appRouter,
})

server.listen(4000)

logger.info("Server listening on port 4000")

const wss = new ws.Server({
  port: 4001,
  path: "/ws",
})

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  // createContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: false, //! this deosn't work
    // server ping message interval in milliseconds
    pingMs: 1000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
})

wss.on("connection", (ws) => {
  logger.info(`Connection open (${wss.clients.size})`)
  ws.once("close", () => {
    logger.info(`Connection close (${wss.clients.size})`)
  })
})
logger.info("WebSocket Server listening on ws://localhost:3001")
process.on("SIGTERM", () => {
  logger.error("Received SIGTERM, closing WebSocket server")
  handler.broadcastReconnectNotification()
  wss.close()
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
export type { Unsubscribable }
