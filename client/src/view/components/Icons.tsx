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
  RefreshDouble,
  Upload,
  MediaImagePlus,
  ClipboardCheck,
} from "iconoir-react"
import { useStore } from "../../model/store"
import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

type IconProps = { iconProps?: Partial<React.SVGProps<SVGSVGElement>> }

const Icon = ({
  children,
  iconProps,
}: {
  children: React.ReactNode
} & IconProps) => {
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
            ...iconProps,
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
            ...iconProps,
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
            ...iconProps,
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

export const UnsyncedIcon = (props: IconProps) => {
  return (
    <Icon iconProps={props.iconProps}>
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

export const UploadingIcon = () => {
  return (
    <div className="text-color-accent">
      <LineMdLoadingTwotoneLoop />
    </div>
  )
}

export const UploadDoneIcon = () => {
  return (
    <Icon>
      <Check />
    </Icon>
  )
}

export const UploadIcon = () => {
  return (
    <Icon>
      <MediaImagePlus />
    </Icon>
  )
}

export const GenerateTodoListIcon = () => {
  return (
    <Icon iconProps={{ color: "currrentColor" }}>
      <ClipboardCheck />
    </Icon>
  )
}

// ##################################################################### //
// ############################# Svg icons ############################# //
// ##################################################################### //

export function LineMdLoadingTwotoneLoop(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
        <path
          strokeDasharray="60"
          strokeDashoffset="60"
          strokeOpacity=".3"
          d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.3s" values="60;0" />
        </path>
        <path strokeDasharray="15" strokeDashoffset="15" d="M12 3C16.9706 3 21 7.02944 21 12">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0" />
          <animateTransform
            attributeName="transform"
            dur="1.3s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </g>
    </svg>
  )
}
