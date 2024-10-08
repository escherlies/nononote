import { useState } from "react"
import { uploadImage } from "../../model/api"
import { IconButton } from "../Ui"
import { UploadDoneIcon, UploadIcon, UploadingIcon } from "./Icons"

export const ViewFileUpload = () => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded">("idle")

  const uploadFile = async (file: null | File) => {
    if (file === null) {
      return
    }

    setUploadState("uploading")

    uploadImage(file)
      .then(() => {
        setUploadState("uploaded")
        setTimeout(() => {
          setUploadState("idle")
        }, 1000)
      })
      .catch(() => {
        setUploadState("idle")
      })
  }

  const handleClick = () => {
    if (inputRef === null) {
      return
    }
    inputRef.click()
  }

  if (uploadState === "uploading") {
    return (
      <IconButton
        ariaLabel="Uploading"
        icon={
          <div className="scale-125">
            <UploadingIcon />
          </div>
        }
        onClick={() => {}}
        className="w-full h-full pointer-events-none"
      ></IconButton>
    )
  }

  if (uploadState === "uploaded") {
    return (
      <IconButton
        ariaLabel="Uploaded"
        className="w-full h-full"
        icon={
          <div className="animate-ping scale-125">
            <UploadDoneIcon />
          </div>
        }
        onClick={() => {}}
      ></IconButton>
    )
  }

  return (
    <div className="w-full h-full">
      <button
        className="h-full w-full bg-background-secondary rounded-xl flex justify-center items-center"
        aria-label="Upload image"
        onClick={handleClick}
      >
        <div className="w-[35px] h-[35px]">
          <UploadIcon />
        </div>
      </button>
      <input
        ref={(ref) => setInputRef(ref)}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const files = e.target.files
          if (files === null) {
            return
          }
          uploadFile(files[0])
        }}
      />
    </div>
  )
}
