import { useEffect } from "react"
import { useAudioRecorder } from "react-audio-voice-recorder"
import { IconButton } from "../Ui"
import { DismissIcon, StartRecording, StopRecording } from "./Icons"

export const VoiceRecorder = () => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder()

  useEffect(() => {
    if (!recordingBlob) return
    // TODO: Upload the recordingBlob to the server
  }, [recordingBlob])

  if (isRecording) {
    return (
      <IconButton
        icon={
          <div className="flex items-center gap-2 relative">
            <div className="bg-red-500 h-1 w-1 absolute top-0 right-0 rounded-full animate-pulse"></div>
            <StopRecording />
          </div>
        }
        onClick={stopRecording}
      ></IconButton>
    )
  }

  return <IconButton icon={<StartRecording />} onClick={startRecording}></IconButton>
}
