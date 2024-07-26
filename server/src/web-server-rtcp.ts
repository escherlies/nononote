import { publicProcedure, router } from "./trpc"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import { observable, Unsubscribable } from "@trpc/server/observable"
import { EventEmitter } from "events"
import ws from "ws"
import { applyWSSHandler } from "@trpc/server/adapters/ws"

import { z } from "zod"

const message = z.union([
  z.object({
    type: z.literal("bar"),
    testData: z.string(),
  }),
  z.object({
    type: z.literal("baz"),
  }),
  z.object({
    type: z.literal("foo"),
  }),
])

const appRouter1 = router({
  hello: publicProcedure
    .input(z.string())
    .output(z.string())
    .mutation(async ({ input }) => {
      return `Hello, ${input}!`
    }),
  message: publicProcedure.input(message).mutation(async (opts) => {
    const { input } = opts
    switch (input.type) {
      case "bar":
        return { ok: 1 }
      case "baz":
        return { ok: 1 }
      case "foo":
        return { ok: 1 }
    }
  }),
  randomNumber: publicProcedure.subscription((foo) => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        // emits a number every second
        emit.next({ randomNumber: Math.random() })
        console.log("emitting")
      }, 1000)

      return () => {
        clearInterval(timer)
      }
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

console.log("Server listening on port 4000")

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
  console.log(`Connection open (${wss.clients.size})`)
  ws.once("close", () => {
    console.log(`Connection close (${wss.clients.size})`)
  })
})
console.log("✅ WebSocket Server listening on ws://localhost:3001")
process.on("SIGTERM", () => {
  console.log("SIGTERM")
  handler.broadcastReconnectNotification()
  wss.close()
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
export type { Unsubscribable }
