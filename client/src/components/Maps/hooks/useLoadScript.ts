import { useState, useEffect } from 'react'

const useLoadScript = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let acc = 0
    const onLoad = () => {
      if (acc === 0) return void (acc = 1)
      return setLoaded(true)
    }
    if (!window.google) {
      const script = document.createElement(`script`)
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDD8gtVtIrx6A0FpaTb7WXy0r1tZR8iECg`

      document.head.append(script)
      script.addEventListener(`load`, onLoad)
      return () => {
        script.removeEventListener(`load`, onLoad)
      }
    }
    return onLoad()
  }, [])
  return loaded
}

export default useLoadScript
