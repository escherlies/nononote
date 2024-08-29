import { PasteIcon, UploadingIcon } from "./Icons"
import { uploadImage } from "../../model/api"
import { setError, setNoteInput } from "../../model/store"
import { useState } from "react"
import toast from "react-hot-toast"

const handleClick = async (onUpload: (uploading: boolean) => void) => {
  const clipboardContents = await navigator.clipboard.read()
  for (const item of clipboardContents) {
    // Handle image
    if (item.types.includes("image/png")) {
      const blob = await item.getType("image/png")
      const file = new File([blob], "clipboard-image.png", { type: "image/png" })
      onUpload(true)
      const timeout = setTimeout(() => {
        onUpload(false)
        toast.error("This is taking longer than expected", { position: "bottom-center" })
      }, 30_000)
      await uploadImage(file)
      clearTimeout(timeout)
      onUpload(false)
    }

    // Handle text
    if (item.types.includes("text/plain")) {
      const blob = await item.getType("text/plain")
      const text = await blob.text()
      setNoteInput(text)
    }
  }
}

export const PasteFromClipboard = () => {
  const [uploading, setUploading] = useState(false)

  return (
    <div className="w-full h-full">
      <button
        className="h-full w-full bg-background-secondary rounded-xl flex justify-center items-center flex-col gap-2"
        aria-label="Paste from clipboard"
        onClick={() => handleClick(setUploading)}
      >
        <div className="w-[35px] h-[35px]">{uploading ? <UploadingIcon /> : <PasteIcon />}</div>
      </button>
    </div>
  )
}
