import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"

export default function api(app: FastifyInstance, opts: never, done: () => void) {
  // Hello
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "get",
    url: "/hello",
    handler: async (req, res) => {
      return res.send("Hello!")
    },
  })

  // Notes
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "post",
    url: "/message",
    websocket: true,
    handler: async (req, res) => {
      return res.send([])
    },
    wsHandler: async (connection, req) => {
      // TODO: Implement
    },
  })

  done()
}
