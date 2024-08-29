import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import type { FileMetadataResponse } from "@google/generative-ai/server"
import { verifyJwt } from "./auth/jwt"
import { path } from "rambda"

import type { Maybe } from "../../shared/types"
import { emitMessageEvent, listenForMessage } from "./events"
import { appMsg } from "./messages"
import fastifyMultipart from "@fastify/multipart"
import { uploadFileToAIFileManager } from "./ai/files"
import { describeImage, transcribeVoiceNote } from "./ai/ai"
import { type AuthenticatedRequest, authenticateUser } from "./auth/auth"
import { moduleLogger } from "./config"

const logger = moduleLogger("api")

export default async function api(app: FastifyInstance, _opts: any, done: () => void) {
  // Hello
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "get",
    url: "/hello",
    handler: async (_req, res) => {
      return res.send("Hello!")
    },
  })

  // Notes http
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "post",
    url: "/message",
    handler: async (_req, res) => {
      return res.send([])
    },
  })

  // Notes websocket
  app.get("/ws", { websocket: true }, (socket) => {
    let user: Maybe<{ id: string }> = null

    // Subscribe to messages
    const unsub = listenForMessage((messageWithContext) => {
      if (user === null) {
        return
      }
      if (user.id !== path("user.id", messageWithContext.context)) {
        return
      }

      socket.send(JSON.stringify(messageWithContext.message))
    })

    // Listen for messages
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
        logger.error(error)
        socket.send("Invalid message")
      }
    })

    socket.on("open", () => {
      logger.debug("Client connected")
    })

    socket.on("close", () => {
      unsub()
      logger.debug("Client disconnected")
    })

    socket.send("Connected")
    logger.debug("Client connected")
  })

  // ##################################################################### //
  // ############################ File upload ############################ //
  // ##################################################################### //

  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 10_000_000, // Max field value (in bytes)
      fields: 10, // Max number of non-file fields
      fileSize: 10_000_000, // For multipart forms, the max file size (in bytes)
      files: 1, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value
    },
  })

  app.post("/upload-image", { preHandler: authenticateUser }, async (req, res) => {
    const user = (req as AuthenticatedRequest).user
    if (!user) {
      return res.status(401).send("Unauthorized")
    }

    // stores files to tmp dir and return files
    const files = await req.saveRequestFiles()
    const file = files[0]

    if (!file) {
      return res.status(400).send("No file uploaded")
    }

    // Upload file to AI file manager
    const uploaded = await uploadFileToAIFileManager(file.filepath, file.mimetype)

    // Handle voice note upload
    if (uploaded.file.mimeType.startsWith("audio")) {
      await handleVoiceNoteUpload(uploaded.file, user)
      res.status(200).send()
    }

    // Handle image upload
    if (uploaded.file.mimeType.startsWith("image")) {
      await handleImageUpload(uploaded.file, user)
      res.status(200).send()
    }

    res.status(400).send("Unsupported file type")
  })

  done()
}

async function handleVoiceNoteUpload(file: FileMetadataResponse, user: { id: string }) {
  // Transscribe the voice note
  const text = await transcribeVoiceNote(file)

  // Emit notes:create event
  emitMessageEvent({
    message: {
      type: "notes:create",
      text,
    },
    context: {
      user,
    },
  })
}

async function handleImageUpload(file: FileMetadataResponse, user: { id: string }) {
  // Describe the image
  const text = await describeImage(file)

  // Emit notes:create event
  emitMessageEvent({
    message: {
      type: "notes:create",
      text,
    },
    context: {
      user,
    },
  })
}
