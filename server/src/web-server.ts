import Fastify, { FastifyPluginAsync } from "fastify"
import api from "./api"
import { moduleLogger } from "./config"

const app = Fastify({
  logger: moduleLogger("web-server"),
})

// Register a plugin to prefix all routes with "/api"
app.register(api as FastifyPluginAsync, { prefix: "/api" })

export async function run() {
  await app.ready()

  await app.listen({
    port: 8000,
    host: "0.0.0.0",
  })
}
