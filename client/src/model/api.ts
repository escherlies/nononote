import { type Message } from "../../../server/src/events"
import { storage } from "./storage"
import { useStore } from "./store"

const API_URL = "/api"
const apiRoute = (path: string) => `${API_URL}${path}`

export const sendMessage = async (message: Message) => {
  // Send message to server
  const response = await fetch(apiRoute("/message"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error("Failed to send message")
  }
}

const AUTH_URL = "/auth"
const authRoute = (path: string) => `${AUTH_URL}${path}`

export const auth = {
  getMagicCode: async (email: string) => {
    const response = await fetch(authRoute("/magic-code"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    console.log({ response })

    if (!response.ok) {
      throw new Error("Failed to get magic code")
    }
  },
  verifyMagicCode: async (email: string, code: string) => {
    const response = await fetch(authRoute("/verify-magic-code"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, magicCode: code }),
    })

    if (!response.ok) {
      throw new Error("Failed to verify magic code")
    }

    const json = (await response.json()) as { jwt: string }

    useStore.setState({ authToken: json.jwt })
    storage.setItem("auth-token", json.jwt)
  },
}
