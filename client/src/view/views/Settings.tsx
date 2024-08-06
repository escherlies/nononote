import { logOut } from "../../model/store"
import { LogOutIcon } from "../components/Icons"
import { IconButton, TextButton } from "../Ui"
import { ColorSchemeSelector } from "./settings/Color"

export const ViewSettings = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <ColorSchemeSelector />
      <TextButton onClick={logOut} className="mt-auto">
        <div className="h-full flex gap-2 break-keep whitespace-nowrap">
          <LogOutIcon />
          <div>Log out</div>
        </div>
      </TextButton>
    </div>
  )
}
