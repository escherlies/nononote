import { AppMsg } from "../../../server/src/messages"
import { storage } from "./storage"
import { handleAuth, handleAuthError, setError, useStore } from "./store"

const API_URL = "/api"
const apiRoute = (path: string) => `${API_URL}${path}`

export const initAuth = async () => {
  const authToken = storage.getItem("auth-token")
  if (authToken) {
    auth.refreshToken(authToken)
  }
}

export const publish = async (message: AppMsg) => {
  console.log("Publishing message:", message)

  const connection = useStore.getState().connection
  if (!connection) {
    setError("Not connected to server")
    return
  }

  connection.send(JSON.stringify(message))
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

    handleAuth(json.jwt)
  },
  refreshToken: async (authToken: string) => {
    try {
      const response = await fetch(authRoute("/refresh-token"), {
        method: "POST",
        headers: {
          Authorization: authToken,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to refresh token")
      }

      const json = (await response.json()) as { jwt: string }

      handleAuth(json.jwt)
    } catch (error) {
      handleAuthError(String(error))
    }
  },
}
