import { useState } from "react"
import { TextButton } from "../Ui"
import { auth } from "../../model/api"
import { Input } from "../components/Input"

import svgLogo from "url:../../../assets/Logo.svg"

export function Auth() {
  return (
    <div className="m-auto">
      <SignIn />
    </div>
  )
}

export function SignIn() {
  const [email, setEmail] = useState("")
  const [emailSend, setEmailSend] = useState(false)
  const [magicCode, setMagicCode] = useState("")

  const signIn = async () => {
    await auth.getMagicCode(email)
    setEmailSend(true)
  }

  const verifyMagicCode = async () => {
    await auth.verifyMagicCode(email, magicCode)
  }

  if (emailSend) {
    return (
      <div className="flex gap-4 flex-col">
        <img src={svgLogo} alt="Logo" className="h-28 mb-4 mr-auto" />
        <div className="text-3xl font-bold">Sign In</div>
        <Input type="text" placeholder="Magic Code" value={magicCode} onText={setMagicCode} />
        <TextButton className="px-8 w-full" onClick={verifyMagicCode}>
          Sign In
        </TextButton>
      </div>
    )
  }

  return (
    <div className="flex gap-4 flex-col">
      <img src={svgLogo} alt="Logo" className="h-28 mb-4 mr-auto" />
      <div className="text-3xl font-bold">Sign In</div>
      <Input type="email" placeholder="Email" value={email} onText={setEmail} />
      <TextButton className="px-8 w-full" onClick={signIn}>
        Send Magic Code
      </TextButton>
    </div>
  )
}
