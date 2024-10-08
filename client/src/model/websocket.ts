import { logger } from "./logger"
import { onSubscriptionReady, removeConnection, setConnection, useStore } from "./store"
import { onSubscriptionData } from "./subscription"

export const initializeWebSocket = async (authToken: string) => {
  const ws = new WebSocket("/api/ws")

  ws.onopen = () => {
    logger.debug("Connected to server")
    ws.send("ping")

    // Authenticate
    ws.send(JSON.stringify({ type: "auth:authenticate", token: authToken }))

    setConnection(ws)
  }

  ws.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data)
      onSubscriptionData(json)
    } catch (_) {
      logger.debug("Message:", event.data)
      if (event.data === "Authenticated") {
        onSubscriptionReady()
      }
    }
  }

  ws.onclose = () => {
    logger.debug("Disconnected from server")
    removeConnection()
    reconnect(authToken)
  }

  // TODO: Handle reconnection
}

const reconnect = (authToken: string) => {
  const reconnectionAttempts = useStore.getState().reconnectionAttempts

  const delay = getReconnnectionDelay(reconnectionAttempts)

  logger.debug(`Reconnecting attempt ${reconnectionAttempts + 1} in ${delay}ms`)
  setTimeout(() => {
    logger.debug("Reconnecting...")
    initializeWebSocket(authToken)
  }, delay)

  useStore.setState((state) => ({ reconnectionAttempts: state.reconnectionAttempts + 1 }))
}

const getReconnnectionDelay = (reconnectionAttempts: number) => {
  return 100 * reconnectionAttempts
}
