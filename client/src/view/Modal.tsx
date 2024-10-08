import { ReactNode } from "react"
import { handleDeleteNote, setModal, useStore } from "../model/store"
import { TextButton } from "./Ui"
import { T } from "../../../shared/types"

export type Modal =
  | T<"Disclaimer">
  | T<"PrivacyPolicy">
  | T<"TermsOfService">
  | T<"DeleteNotePrompt", { noteId: string }>

export const ViewModal = () => {
  const modal = useStore((state) => state.modal)

  if (!modal) {
    return null
  }

  switch (modal.tag) {
    case "Disclaimer":
      return (
        <ModalOverlay>
          <div className="prose prose-h1:text-color-accent prose-h1:uppercase dark:prose-invert">
            <h1>Disclaimer</h1>
            <p>Thanks for trying out this software! Here are a few things to keep in mind:</p>
            <ul>
              <li>
                This software is actively being developed, with many exciting new features coming
                soon.
              </li>
              <li>
                Please note that all data is stored in plaintext on the server and is not encrypted.
              </li>
              <li>
                Additionally, notes are classified by an AI and sent in plaintext for this purpose.
              </li>
              <li>However, the notes are not used as training data for the AI.</li>
            </ul>
          </div>
          <div>
            <TextButton onClick={() => setModal(null)}>Ok, sign me up! 🙂</TextButton>
          </div>
        </ModalOverlay>
      )

    case "PrivacyPolicy":
      // TODO: Add privacy policy
      return null

    case "TermsOfService":
      // TODO: Add terms of service
      return null

    case "DeleteNotePrompt":
      return (
        <ModalOverlay>
          <div className="prose prose-h1:text-color-accent prose-h1:uppercase dark:prose-invert">
            <h1>Delete note?</h1>
            <p>Are you sure you want to delete this note?</p>
            <div className="flex gap-4">
              <TextButton onClick={() => setModal(null)}>Cancel</TextButton>
              <TextButton onClick={() => handleDeleteNote(modal.noteId)}>Delete</TextButton>
            </div>
          </div>
        </ModalOverlay>
      )
  }
}

type Props = {
  children: ReactNode
}
const ModalOverlay = ({ children }: Props) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-85 dark:bg-background-primary backdrop-blur-sm h-full w-full flex justify-center items-center gap-8 flex-col">
      <div className="flex flex-col gap-4 max-w-lg p-5">{children}</div>
    </div>
  )
}
