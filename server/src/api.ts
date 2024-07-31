import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"

export default function api(
  app: FastifyInstance,
  opts: never,
  done: () => void
) {
  // Hello
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "get",
    url: "/hello",
    handler: async (req, res) => {
      return res.send("Hello!")
    },
  })

  done()
}
