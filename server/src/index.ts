import { moduleLogger } from "./config"
import monzod from "./db"
import { run } from "./web-server"

const logger = moduleLogger("index")

async function main() {
  logger.info("Starting server...")

  logger.info("Connecting to database...")
  await monzod.connect()

  logger.info("Starting web server...")
  run()
}

main().catch((error) => {
  logger.error("An error occurred while starting the server", error)
  process.exit(1)
})
