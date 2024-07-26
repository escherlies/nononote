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
