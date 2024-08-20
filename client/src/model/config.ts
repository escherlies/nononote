import Bowser from "bowser"

const browser = Bowser.getParser(window.navigator.userAgent)

// Constants

export const VERSION = process.env.VERSION || "unknown"

export const SMALL_SCREEN_BREAKPOINT = 640

export const IS_MOBILE_PLATTFORM = browser.getPlatform().type === "mobile"

export const IS_STANDALONE = window.matchMedia("(display-mode: standalone)").matches
