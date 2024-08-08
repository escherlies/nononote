import { useEffect, useState } from "react"
import { useAudioRecorder } from "react-audio-voice-recorder"
import { IconButton } from "../Ui"
import { DismissIcon, StartRecording, StopRecording, UploadDoneIcon, UploadingIcon } from "./Icons"
import { uploadVoiceNote } from "../../model/api"

export const VoiceRecorder = () => {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded">("idle")

  const { startRecording, stopRecording, recordingBlob, isRecording } = useAudioRecorder()

  useEffect(() => {
    if (!recordingBlob) return

    setUploadState("uploading")

    uploadVoiceNote(recordingBlob)
      .then(() => {
        setUploadState("uploaded")
        setTimeout(() => {
          setUploadState("idle")
        }, 1000)
      })
      .catch(() => {
        setUploadState("idle")
      })
  }, [recordingBlob])

  if (uploadState === "uploading") {
    return (
      <IconButton
        icon={
          <div className="animate-spin ">
            <UploadingIcon />
          </div>
        }
        onClick={() => {}}
        className="pointer-events-none"
      ></IconButton>
    )
  }

  if (uploadState === "uploaded") {
    return (
      <IconButton
        icon={
          <div className="animate-ping">
            <UploadDoneIcon />
          </div>
        }
        onClick={() => {}}
      ></IconButton>
    )
  }

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