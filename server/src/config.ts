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

// Check if the environment variable is set, otherwise throw up

const getEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable ${name}`)
  }
  return process.env[name] as string
}

export const NOTES_FOLDER = getEnv("NOTES_FOLDER")
