import { onSubscriptionReady, removeConnection, setConnection } from "./store"
import { onSubscriptionData } from "./subscription"

export const initializeWebSocket = async (authToken: string) => {
  const ws = new WebSocket("/api/ws")
  ws.onopen = () => {
    console.log("Connected to server")
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
      console.log("Message:", event.data)
      if (event.data === "Authenticated") {
        onSubscriptionReady()
      }
    }
  }

  ws.onclose = () => {
    console.log("Disconnected from server")

    removeConnection()
  }

  // TODO: Handle reconnection
}
