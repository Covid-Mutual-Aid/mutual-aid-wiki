import React, { useState, useEffect, createContext, useCallback, useContext } from 'react'
import { useSpring, animated } from 'react-spring'

const ModalContext = createContext<(fn?: () => void) => void>(() => null)

const withModal = <P extends any>(Component: React.FC<P>): React.FC<P> => (props) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const styles = useSpring({
    to: {
      transform: `translateY(${mounted ? '-5rem' : '0rem'})`,
      position: 'fixed',
      height: 'calc(100vh + 5rem)',
      width: '100vw',
      top: '0px',
      paddingTop: `${!!mounted ? '0rem' : '5rem'}`,
      backgroundColor: `rgba(255,255,255,${mounted ? '.8' : '0'})`,
      zIndex: 4,
    },
  })

  const close = useCallback((fn?: () => void) => {
    setMounted(false)
    if (fn) setTimeout(fn, 200)
  }, [])

  return (
    <ModalContext.Provider value={close}>
      <animated.div style={styles}>
        <Component {...props} />
      </animated.div>
    </ModalContext.Provider>
  )
}

export default withModal

export const useModalClose = () => useContext(ModalContext)
