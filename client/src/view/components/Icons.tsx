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
} from "iconoir-react"

const Icon = ({ children }: { children: React.ReactNode }) => {
  return (
    <IconoirProvider
      iconProps={{
        strokeWidth: 2,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </IconoirProvider>
  )
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
      <CloudXmark />
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
