import { createTRPCClient, createWSClient, wsLink } from "@trpc/client"
import type {
  AppRouter,
  Unsubscribable,
} from "../../../server/src/web-server-rtcp"
import { logger } from "./logger"

const wsClient = createWSClient({
  url: "/ws",
  onClose(cause) {
    logger.warn("wsClient was closed", cause)
  },
  retryDelayMs(attemptIndex) {
    return Math.min(attemptIndex * 1000, 30_000)
  },
})

const trpc = createTRPCClient<AppRouter>({
  links: [
    // // call subscriptions through websockets and the rest over http
    // splitLink({
    //   condition(op) {
    //     return op.type === 'subscription';
    //   },
    //   true: wsLink({
    //     client: wsClient,
    //   }),
    //   false: httpLink({
    //     url: ''
    //   }),
    // }),
    // or just use ws for everything
    wsLink({
      client: wsClient,
    }),
  ],
})

export default trpc
export type { Unsubscribable }
