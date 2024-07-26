import {
  getTestData,
  stopSubscription,
  startSubscription,
  useStore,
} from "../model/store"

export function TrcpTest() {
  const testData = useStore((state) => state.testData)
  const subscription = useStore((state) => state.testSubscription)

  return (
    <div className="flex flex-col gap-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={getTestData}
      >
        Get Test Data
      </button>
      {subscription ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={stopSubscription}
        >
          Stop Subscription
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startSubscription}
        >
          Start Subscription
        </button>
      )}
      <code>{testData}</code>
    </div>
  )
}
