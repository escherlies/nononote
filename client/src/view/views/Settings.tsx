import { logOut } from "../../model/store"
import { LogOutIcon } from "../components/Icons"
import { IconButton, TextButton } from "../Ui"
import { ColorSchemeSelector } from "./settings/Color"

export const ViewSettings = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <ColorSchemeSelector />
      <div className="mt-auto">
        <TextButton onClick={logOut}>
          <LogOutIcon />
          <div>Log out</div>
        </TextButton>
      </div>
    </div>
  )
}
