import { logOut } from "../../model/store"
import { startGenerateTodosTour } from "../../model/tours/generate-todos.tour"
import { startInitialTour } from "../../model/tours/initial.tour"
import { LogOutIcon, ShowTourIcon } from "../components/Icons"
import { Label, Section, TextButton, Title } from "../Ui"
import { Version } from "../Version"
import { ColorSchemeSelector } from "./settings/Color"

export const ViewSettings = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <Title>Settings</Title>
      <Section label="Color scheme">
        <ColorSchemeSelector />
      </Section>
      <div className="flex flex-col gap-1">
        <Label>Help</Label>
        <TextButton className="w-full" onClick={startInitialTour}>
          <div className="w-6 h-6">
            <ShowTourIcon />
          </div>
          <div>Start tour</div>
        </TextButton>
        <TextButton className="w-full" onClick={startGenerateTodosTour}>
          <div className="w-6 h-6">
            <ShowTourIcon />
          </div>
          <div>Generate to-do list</div>
        </TextButton>
      </div>

      <div className="mt-auto">
        <div>
          <Label>Account</Label>
          <TextButton onClick={logOut}>
            <div className="w-6 h-6">
              <LogOutIcon />
            </div>
            <div>Log out</div>
          </TextButton>
        </div>
      </div>
      <div className="text-xs text-gray-400 text-center">
        <Version />
      </div>
    </div>
  )
}
