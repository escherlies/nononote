import Fastify, { type FastifyPluginAsync } from "fastify"
import api from "./api"
import { moduleLogger } from "./config"
import ws from "@fastify/websocket"
import authRouter from "./auth/routes"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"

const app = Fastify({
  logger: moduleLogger("web-server"),
})

// Register websocket support
app.register(ws)

async function setUp() {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Api routes
  await app.register(api as FastifyPluginAsync, { prefix: "/api" })

  // Auth routes
  await app.register(authRouter as FastifyPluginAsync, { prefix: "/auth" })
}

// Start the server
export async function run() {
  await setUp()

  await app.ready()

  await app.listen({
    port: 8000,
    host: "0.0.0.0",
  })
}
