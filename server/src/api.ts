import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { verifyJwt } from "./auth/jwt"
import { Maybe } from "../../shared/types"
import { emitMessageEvent } from "./events"
import { appMsg } from "./messages"

export default function api(app: FastifyInstance, opts: never, done: () => void) {
  // Hello
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "get",
    url: "/hello",
    handler: async (req, res) => {
      return res.send("Hello!")
    },
  })

  // Notes http
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "post",
    url: "/message",
    handler: async (req, res) => {
      return res.send([])
    },
  })

  // Notes websocket
  app.get("/ws", { websocket: true }, (socket, req) => {
    let user: Maybe<{ id: string }> = null

    socket.on("message", (msg) => {
      const stringMessage = msg.toString()
      if (stringMessage === "ping") {
        socket.send("pong")
        return
      }

      try {
        const json = JSON.parse(stringMessage)
        const message = appMsg.parse(json)

        if (message.type === "auth:authenticate") {
          user = verifyJwt(message.token)
          socket.send("Authenticated")
        }

        if (user === null) {
          socket.send("Unauthorized")
          return
        }

        emitMessageEvent({
          message: message,
          context: {
            user,
          },
        })
      } catch (error) {
        console.error(error)
        socket.send("Invalid message")
      }
    })
  })

  done()
}
