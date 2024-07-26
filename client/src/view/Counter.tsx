import { decrementCounter, incrementCounter, useStore } from "../model/store"

export function Counter() {
  const counter = useStore((state) => state.counter)

  return (
    <div>
      <div className="text-2xl font-bold">{counter}</div>
      <div>
        <button
          onClick={incrementCounter}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          Increment
        </button>
        <button
          onClick={decrementCounter}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
