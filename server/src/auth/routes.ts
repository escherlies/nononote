import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateMagicCode, verifyMagicCode } from "./auth"
import { signJwt, verifyJwt } from "./jwt"
import { sendMagicCode } from "../email"
import monzod from "../db"

interface AuthenticatedRequest extends FastifyRequest {
  user?: { id: string } // Replace `YourUserType` with the type returned from `verifyJwt`
}

export default function authRouter(app: FastifyInstance, opts: never, done: () => void) {
  // Get magic code
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "post",
    url: "/magic-code",
    schema: {
      description: "Get magic code",
      body: z.object({
        email: z.string().email(),
      }),
      response: {
        200: z.literal("ok"),
      },
    },
    handler: async (req, res) => {
      const magicCode = await generateMagicCode(req.body.email)
      await sendMagicCode({ to: req.body.email, magicCode: magicCode })
      return res.status(200).send()
    },
  })

  // Verify magic code
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "post",
    url: "/verify-magic-code",
    schema: {
      description: "Verify magic code",
      body: z.object({
        email: z.string().email(),
        magicCode: z.string(),
      }),
    },
    handler: async (req, res) => {
      const verifyMagicCode_ = await verifyMagicCode({ email: req.body.email, magicCode: req.body.magicCode })
      if (!verifyMagicCode_) {
        return res.status(400).send()
      }
      const jwt = await signJwt({ id: verifyMagicCode_.userId })
      return res.send({ jwt })
    },
  })

  // Refresh token
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "post",
    url: "/refresh-token",
    schema: {
      description: "Refresh token",
      headers: z.object({
        authorization: z.string(),
      }),
    },
    preHandler: authenticateUser,
    handler: async (req: AuthenticatedRequest, res) => {
      const user = await monzod.cols.users.findOne({ id: req.user!.id })

      if (!user) {
        return res.status(400).send("User not found")
      }
      const jwt = signJwt({ id: req.user!.id })
      return res.send({ jwt })
    },
  })

  done()
}

const authenticateUser = async (req: AuthenticatedRequest, reply: FastifyReply, done: () => void) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    return reply.status(401).send("Unauthorized")
  }

  const token = bearer.replace("Bearer ", "")
  const user = verifyJwt(token)
  if (!user) {
    return reply.status(401).send("Unauthorized")
  }

  req.user = user

  done()

  return reply
}