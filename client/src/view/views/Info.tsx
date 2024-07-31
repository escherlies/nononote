import { useStore } from "../../model/store"

/**
 * A React functional component that displays connection information.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const ViewInfo = (): JSX.Element => {
  const isConnected = useStore((state) => state.isConnected)
  return (
    <div>
      <div className="text-lg font-bold">Info</div>
      <div>{isConnected ? "Connected" : "Disconnected"}</div>
    </div>
  )
}
