import React, { useState, useEffect } from 'react'

const safeParse = <T extends any>(key: string, init: T): T => {
  let result
  try {
    result = JSON.parse(localStorage.getItem(key) as any)
  } catch (err) {
    localStorage.setItem(key, JSON.stringify(init))
    result = init
  }
  return result
}

type UseLocalyStoredState = {
  <S extends any>(key: string): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>]
  <S extends any>(key: string, initialState: S): [S, React.Dispatch<React.SetStateAction<S>>]
}
// Implementation
const useLocalyStoredState: UseLocalyStoredState = <S extends any>(
  key: string,
  initialState?: S
): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>] => {
  const [state, setState] = useState<S | undefined>(safeParse<S | undefined>(key, initialState))
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}
export default useLocalyStoredState
