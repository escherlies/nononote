import jwt from "jsonwebtoken" // jwt
import { JWT_SECRET } from "../config"

export const signJwt = (payload: { id: string }): string => jwt.sign(JSON.stringify(payload), JWT_SECRET)

export const verifyJwt = (token: string) => jwt.verify(token, JWT_SECRET) as { id: string }
