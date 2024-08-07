import { ReactNode } from "react"
import { setModal, useStore } from "../model/store"
import { TextButton } from "./Ui"

export type Modal = "Disclaimer" | "PrivacyPolicy" | "TermsOfService"

export function ViewModal() {
  const modal = useStore((state) => state.modal)

  switch (modal) {
    case null:
      return null

    case "Disclaimer":
      return (
        <ModalOverlay>
          <div className="prose prose-h1:text-color-accent prose-h1:uppercase dark:prose-invert">
            <h1>Disclaimer</h1>
            <p>Thanks for trying out this software! Here are a few things to keep in mind:</p>
            <ul>
              <li>This software is a demo. Many features are still missing.</li>
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
