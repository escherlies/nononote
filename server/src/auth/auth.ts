import { toLower } from "rambda"
import monzod from "../db"
import { genMagicCode, safeid } from "../nanoid"
// import bcrypt from "bcrypt"
import { moduleLogger } from "../config"
import type { FastifyReply, FastifyRequest } from "fastify"
import { verifyJwt } from "./jwt"

const logger = moduleLogger("auth")

export interface AuthenticatedRequest extends FastifyRequest {
  user?: { id: string } // Replace `YourUserType` with the type returned from `verifyJwt`
}

export const authenticateUser = async (req: AuthenticatedRequest, reply: FastifyReply, done: () => void) => {
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

const getOrCreateUser = async (email: string) => {
  const existing = await monzod.cols.users.findOne({ email: toLower(email) })

  if (existing) {
    return existing
  }

  const user = {
    id: safeid("u_"),
    name: toLower(email.split("@")[0] || "Noname"),
    email: toLower(email),
    // password: bcrypt.hashSync(initialPassword, saltRounds),
  }
  const res = await monzod.cols.users.insertOne(user)

  if (!res.acknowledged) {
    logger.fatal("getOrCreateUser: mongo user insertin: %o")
    throw new Error()
  }

  return user
}

export const generateMagicCode = async (email: string): Promise<string> => {
  const magicCode = genMagicCode()
  const user = await getOrCreateUser(email)

  // check for existing
  const existing = await monzod.cols.magicCodes.findOne({
    email: toLower(email),
    magicCodeExpiresAt: { $gt: new Date().valueOf() },
  })

  if (existing) {
    logger.debug("sendMagicCode: existing magic code: %o", existing)
    // throw new Error(
    //   "A magic code has already been sent to this email address. Please check your inbox. If you can't find it, please check your spam folder. If you still can't find it, please try again in five minutes."
    // )

    return existing.magicCode
  }

  const res = await monzod.cols.magicCodes.insertOne({
    id: safeid("magic_"),
    userId: user.id,
    email: toLower(email),
    magicCode,
    magicCodeExpiresAt: new Date().valueOf() + 5 * 60 * 1000,
  })

  if (!res.acknowledged) {
    logger.fatal("sendMagicCodi: mongo magic insertin: %o")
    throw new Error()
  }

  logger.debug("Magic Code: %s", magicCode)

  return magicCode
}

export const verifyMagicCode = async ({ magicCode, email }: { magicCode: string; email: string }) => {
  const res = await monzod.cols.magicCodes.findOne({
    email: toLower(email),
    magicCode,
    magicCodeExpiresAt: { $gt: new Date().valueOf() },
  })

  if (res) {
    // delete magic codes
    void monzod.cols.magicCodes.deleteMany({ email: toLower(email) })
  }

  return res
}

// // sign up with email, password and name
// type SignUpParams = {
//   email: string
//   password: string
//   name: string
// }
// export const signUpWithPassword = async ({ email, password, name }: SignUpParams) => {
//   const existingUser = await monzod.cols.users.findOne({ emails: { $in: [toLower(email)] } })
//   logger.debug({ existingUser })

//   if (existingUser) {
//     return loginWithPassword(email, password)
//   }

//   const encrypted = await bcrypt.hash(password, saltRounds)
//   const user: User = {
//     emails: [toLower(email)],
//     password: encrypted,
//     name: name,
//     id: safeid("user_"),
//   }

//   const res = await monzod.cols.users.insertOne(user)

//   if (!res.acknowledged) {
//     logger.fatal("signUpWithPassword: mongo user insertin: %o")
//     throw new Error("Error creating user")
//   }

//   return user
// }

// // very simple password login
// export const loginWithPassword = async (email: string, password: string) => {
//   const user = await monzod.cols.users.findOne({ emails: { $in: [toLower(email)] } })

//   if (!user) {
//     return null
//   }

//   const match = await bcrypt.compare(password, user.password)

//   if (match) {
//     return user
//   }

//   return null
// }

// // request magic code for password reset
// export const requestPasswordResetEmail = async (origin: string, email: string): Promise<void> => {
//   const existingUser = await monzod.cols.users.findOne({ emails: { $in: [toLower(email)] } })
//   if (!existingUser) {
//     throw new Error("User not found")
//   }

//   // Invalidate existing
//   await monzod.cols.magicCodes.deleteMany({ email: toLower(email) })

//   const magicCode = await generateMagicCode(email)
//   const resetLink = `${origin}/set-new-password?email=${encodeURIComponent(email)}&magicCode=${encodeURIComponent(
//     magicCode
//   )}`
//   // send magic code to user's email
//   existingUser.emails.forEach((email) => {
//     sendPasswordResetEmail({
//       to: email,
//       resetLink,
//     })
//   })
// }

// // password reset function
// export const resetPassword = async (email: string, newPassword: string, magicCode: string) => {
//   const user = await monzod.cols.users.findOne({ emails: { $in: [toLower(email)] } })
//   if (!user) {
//     throw new Error("User not found")
//   }
//   const existingMagicCode = await monzod.cols.magicCodes.findOne({
//     email: toLower(email),
//     magicCode,
//     magicCodeExpiresAt: { $gt: new Date().valueOf() },
//   })
//   if (!existingMagicCode) {
//     throw new Error("Invalid magic code")
//   }
//   const encrypted = await bcrypt.hash(newPassword, saltRounds)
//   const res = await monzod.cols.users.updateOne({ _id: user._id }, { $set: { password: encrypted } })
//   if (!res.acknowledged) {
//     logger.fatal("resetPassword: mongo user update: %o")
//     throw new Error("Error resetting password")
//   }
//   // delete magic codes
//   void monzod.cols.magicCodes.deleteMany({ email: toLower(email) })

//   return user
// }
