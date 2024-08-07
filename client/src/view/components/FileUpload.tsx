import { useState } from "react"
import { uploadImage } from "../../model/api"
import { IconButton } from "../Ui"
import { UploadDoneIcon, UploadIcon, UploadingIcon } from "./Icons"

export const ViewFileUpload = () => {
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

  return (
    <div>
      <label htmlFor="file-upload">
        <IconButton icon={<UploadIcon />} onClick={() => {}}></IconButton>
      </label>
      <input
        id="file-upload"
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
