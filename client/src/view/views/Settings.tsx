import { logOut } from "../../model/store"
import { startTour } from "../../model/tour"
import { LogOutIcon, ShowTourIcon } from "../components/Icons"
import { TextButton } from "../Ui"
import { ColorSchemeSelector } from "./settings/Color"

export const ViewSettings = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <ColorSchemeSelector />
      <TextButton onClick={startTour}>
        <div className="w-6 h-6">
          <ShowTourIcon />
        </div>
        <div>Start tour</div>
      </TextButton>
      <div className="mt-auto">
        <TextButton onClick={logOut}>
          <LogOutIcon />
          <div>Log out</div>
        </TextButton>
      </div>
    </div>
  )
}
