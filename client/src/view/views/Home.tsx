import { useStore } from "../../model/store"
import { ViewFileUpload } from "../components/FileUpload"
import { NoteInput } from "../components/NoteInput"
import { VoiceRecorder } from "../components/VoiceRecorder"
import { ViewLastNote } from "./Notes"

export function ViewHome() {
  const noteInput = useStore((state) => state.noteInput)

  // TODO: handle other input types
  const inputState = noteInput === "" ? null : ("text" as null | "text" | "audio" | "upload")

  const isHidden = (state: string) => inputState !== null && inputState !== state

  const isAudioAndUploadHidden =
    inputState !== null && inputState !== "audio" && inputState !== "upload"

  return (
    <div className="flex gap-5 flex-col h-full w-full">
      <div className={`flex-1 ${isHidden("text") ? "hidden" : ""}`}>
        <NoteInput />
      </div>
      <div
        id="voice-and-file-container"
        className={`flex gap-5 flex-1 ${isAudioAndUploadHidden ? "hidden" : ""}`}
      >
        <div className={`flex-1 ${isHidden("audio") ? "hidden" : ""}`}>
          <VoiceRecorder />
        </div>
        <div className={`flex-1 ${isHidden("upload") ? "hidden" : ""}`}>
          <ViewFileUpload />
        </div>
      </div>
      <div className={`h-[10%] ${inputState !== null ? "hidden" : ""}`}></div>
      <div id="last-note-container" className={`flex-1 ${inputState !== null ? "hidden" : ""}`}>
        <ViewLastNote />
      </div>
    </div>
  )
}
