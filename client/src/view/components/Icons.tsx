import {
  IconoirProvider,
  Check,
  Plus,
  QuestionMark,
  Archive,
  Settings,
  Search,
  CloudXmark,
  EditPencil,
  MoreHoriz,
  Xmark,
  NavArrowLeft,
  LogOut,
  MultiplePagesXmark,
  CloudSync,
  Microphone,
  MicrophoneCheck,
} from "iconoir-react"
import { useStore } from "../../model/store"

const Icon = ({ children }: { children: React.ReactNode }) => {
  const theme = useStore((state) => state.settings.theme)

  switch (theme) {
    case "brutalist":
      return (
        <IconoirProvider
          iconProps={{
            strokeWidth: 2,
            width: "100%",
            height: "100%",
            color: "var(--color-accent)",
          }}
        >
          {children}
        </IconoirProvider>
      )
    case "space-craft":
      return (
        <IconoirProvider
          iconProps={{
            strokeWidth: 1.5,
            width: "100%",
            height: "100%",
            color: "var(--color-accent)",
          }}
        >
          {children}
        </IconoirProvider>
      )
    case "modern":
      return (
        <IconoirProvider
          iconProps={{
            strokeWidth: 1.5,
            width: "100%",
            height: "100%",
            color: "var(--color-accent)",
          }}
        >
          {children}
        </IconoirProvider>
      )
  }
}

// ##################################################################### //
// ############################### Icons ############################### //
// ##################################################################### //

export const NewNoteIcon = () => {
  return (
    <Icon>
      <Plus />
    </Icon>
  )
}

export const InfoOrHelpIcon = () => {
  return (
    <Icon>
      <QuestionMark />
    </Icon>
  )
}

export const NotesIcon = () => {
  return (
    <Icon>
      <Archive />
    </Icon>
  )
}

export const SettingsIcon = () => {
  return (
    <Icon>
      <Settings />
    </Icon>
  )
}

export const SearchIcon = () => {
  return (
    <Icon>
      <Search />
    </Icon>
  )
}
export const SaveNoteIcon = () => {
  return (
    <Icon>
      <Check />
    </Icon>
  )
}

export const UnsyncedIcon = () => {
  return (
    <Icon>
      <CloudSync />
    </Icon>
  )
}

export const Pencil = () => {
  return (
    <Icon>
      <EditPencil />
    </Icon>
  )
}

export const MoreActionsIcon = () => {
  return (
    <Icon>
      <MoreHoriz />
    </Icon>
  )
}

export const DismissIcon = () => {
  return (
    <Icon>
      <Xmark />
    </Icon>
  )
}

export const GoBackIcon = () => {
  return (
    <Icon>
      <NavArrowLeft className="-translate-x-[1px]" />
      {/*                      ^ visually align the chevron */}
    </Icon>
  )
}

export const LogOutIcon = () => {
  return (
    <Icon>
      <LogOut />
    </Icon>
  )
}

export const DeleteIcon = () => {
  return (
    <Icon>
      <MultiplePagesXmark />
    </Icon>
  )
}

export const StartRecording = () => {
  return (
    <Icon>
      <Microphone />
    </Icon>
  )
}

export const StopRecording = () => {
  return (
    <Icon>
      <MicrophoneCheck />
    </Icon>
  )
}
