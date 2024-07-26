import { Counter } from "./Counter"
import { TrcpTest } from "./TrcpTest"
import { SubTitle, Title } from "./Ui"
import { Version } from "./Version"

export function App() {
  return (
    <div className="w-dvw h-dvh bg-gray-100 flex">
      <div className="flex flex-col gap-4 m-auto">
        <Title>Hello, Wörld!</Title>
        {/* Test */}
        <SubTitle>Test:</SubTitle>
        <TrcpTest></TrcpTest>

        {/* Counter */}
        <SubTitle>Simple state example:</SubTitle>
        <Counter />

        {/* Version */}
        <div className="font-mono text-sm">
          Version: <Version />
        </div>
      </div>
    </div>
  )
}
