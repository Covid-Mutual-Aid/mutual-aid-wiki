import { useState, useEffect } from 'react'

let script: HTMLScriptElement
export const useLoadScript = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const onLoad = () => setLoaded(true)
    if (!window.google || script) {
      script = document.createElement(`script`)
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg`
      document.head.append(script)
      script.addEventListener(`load`, onLoad)
      return () => script.removeEventListener(`load`, onLoad)
    }
    return onLoad()
  }, [])
  return loaded
}
