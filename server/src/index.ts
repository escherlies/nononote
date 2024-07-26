import { moduleLogger } from "./config"
import { run } from "./web-server"

import "./web-server-rtcp"

const logger = moduleLogger("index")

async function main() {
  logger.info("Starting server...")

  // Start the web server
  logger.info("Starting web server...")
  run()
}

main().catch((error) => {
  logger.error("An error occurred while starting the server", error)
  process.exit(1)
})
