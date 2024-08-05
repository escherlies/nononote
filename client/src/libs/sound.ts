let audioCtx_: AudioContext | undefined
let gain_: GainNode | undefined

const getAudioCtx = () => {
  if (audioCtx_ && gain_)
    return {
      audioCtx: audioCtx_,
      gain: gain_,
    }

  audioCtx_ = new AudioContext()
  gain_ = audioCtx_.createGain()
  gain_.connect(audioCtx_.destination)

  return {
    audioCtx: audioCtx_,
    gain: gain_,
  }
}

const bufferCache = new Map<string, AudioBuffer>()

const getFile = async (filepath: string) => {
  const cachedBuffer = bufferCache.get(filepath)
  if (cachedBuffer) return cachedBuffer

  const { audioCtx } = getAudioCtx()

  const response = await fetch(filepath)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

  bufferCache.set(filepath, audioBuffer)

  return audioBuffer
}

export const playSound = async (src: string, vol: number, offset?: number, duration?: number) => {
  const { audioCtx, gain } = getAudioCtx()

  const audioBuffer = await getFile(src)
  const trackSource = audioCtx.createBufferSource()
  gain.gain.value = vol
  trackSource.buffer = audioBuffer
  trackSource.connect(gain)
  trackSource.start(0, offset, duration)
}
