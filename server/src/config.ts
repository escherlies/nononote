import pino from "pino"
import pinoPretty from "pino-pretty"

const stream = pinoPretty({
  colorize: true,
  ignore: "pid,hostname",
})

export const moduleLogger = (name: string) =>
  pino(
    {
      name,
      level: "debug",
    },
    stream
  )

const logger = moduleLogger("config")

// Check if the environment variable is set, otherwise throw up

const getEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable ${name}`)
  }
  return process.env[name] as string
}

const getOptionalEnv = (name: string) => {
  if (!process.env[name]) {
    logger.info(`Ignoring optional environment variable ${name}`)
    return null
  }
  return process.env[name] as string
}

export const NOTES_FOLDER = getEnv("NOTES_FOLDER")
export const GOOGLE_GENERATIVE_AI_API_KEY = getEnv("GOOGLE_GENERATIVE_AI_API_KEY")

export const MONGO_DB_URI = getEnv("MONGO_DB_URI")

export const SMTP_USER = getEnv("SMTP_USER")
export const SMTP_PASSWORD = getEnv("SMTP_PASSWORD")
export const SMTP_HOST = getEnv("SMTP_HOST")
export const SMTP_PORT = parseInt(getEnv("SMTP_PORT"))

export const JWT_SECRET = getEnv("JWT_SECRET")

// Emails
export const SEND_EMAILS = getEnv("SEND_EMAILS") === "true"
export const EMAIL_FROM = getEnv("EMAIL_FROM")
export const DEBUG_EMAIL_BCC = getOptionalEnv("DEBUG_EMAIL_BCC")
