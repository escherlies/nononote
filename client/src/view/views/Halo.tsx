import { useState, useEffect, useRef } from "react"
import HALO from "vanta/dist/vanta.halo.min"
import * as THREE from "three"

type Props = JSX.IntrinsicElements["div"]

export const MyComponent = (props: Props) => {
  const [vantaEffect, setVantaEffect] = useState(null as null | { destroy: () => void })
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 100.0,
          minWidth: 200.0,
          size: 2,
          baseColor: 0x7800ff,
          backgroundColor: 0x001aff,
          THREE: THREE, // use a custom THREE when initializing
        })
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div className="w-full h-full rounded-xl" ref={myRef}>
      {props.children}
    </div>
  )
}
