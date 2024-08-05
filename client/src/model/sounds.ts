import press from "url:../../assets/audio/press.mp3"
import release from "url:../../assets/audio/release.mp3"
import { playSound } from "../libs/sound"
import { useStore } from "./store"

export const playPress = () => {
  const buttonSound = useStore.getState().settings.buttonSound
  if (!buttonSound) {
    return
  }

  playSound(press, 1)
}

export const playRelease = () => {
  const buttonSound = useStore.getState().settings.buttonSound
  if (!buttonSound) {
    return
  }

  playSound(release, 1)
}
