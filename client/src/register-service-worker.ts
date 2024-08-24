import { logger } from "./model/logger"

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      navigator.serviceWorker
        .register(new URL("sw.ts", import.meta.url), {
          type: "module",
        })
        .then((registration) => {
          logger.debug("ServiceWorker registration successful with scope: ", registration.scope)

          registration.installing // the installing worker, or undefined
          registration.waiting // the waiting worker, or undefined
          registration.active // the active worker, or undefined

          registration.addEventListener("updatefound", () => {
            // A wild service worker has appeared in registration.installing!
            const newWorker = registration.installing

            logger.debug("New worker found, state: ", newWorker?.state)
            // "installing" - the install event has fired, but not yet complete
            // "installed"  - install complete
            // "activating" - the activate event has fired, but not yet complete
            // "activated"  - fully active
            // "redundant"  - discarded. Either failed install, or it's been
            //                replaced by a newer version

            newWorker?.addEventListener("statechange", () => {
              // newWorker.state has changed
              logger.debug("New worker state changed: ", newWorker.state)
            })

            // Check for updates whenever the app is brought to the foreground
            document.addEventListener("visibilitychange", () => {
              if (document.visibilityState === "visible") {
                logger.debug("App is back in the foreground, checking for updates...")
                registration.update() // Trigger an update check
              }
            })
          })
        })
        .catch((error) => {
          logger.debug("ServiceWorker registration failed: ", error)
        })
    })
  }
}

export const unregisterServiceWorker = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            resolve()
          })
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
