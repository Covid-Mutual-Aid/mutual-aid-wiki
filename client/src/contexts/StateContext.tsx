import React, { createContext, useContext, useCallback, useMemo, useState } from 'react'
import useLocationSearch, { Place } from '../utils/useLocationSearchNew'
import { useLocation, useHistory } from 'react-router-dom'

const StateMethodContext = createContext<{
  onSearch: (x?: string) => void
  onSelect: (x?: string) => void
}>({
  onSearch: () => null,
  onSelect: () => null,
})

const StateContext = createContext<{
  search: { place: null | Place; error: null | string }
  selected: string | null
}>({
  search: { place: null, error: null },
  selected: null,
})

const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<null | string>(null)
  const { search } = useLocation()
  const history = useHistory()
  const { error, place } = useLocationSearch(search.replace('?', ''))

  const onSearch = useCallback(
    (query?: string) => {
      if (!query) return history.replace(`?`)
      history.replace(`?${query}`)
      return void null
    },
    [history]
  )

  const onSelect = useCallback((x?: string) => setSelected(x || null), [])

  return (
    <StateMethodContext.Provider
      value={useMemo(() => ({ onSelect, onSearch }), [onSelect, onSearch])}
    >
      <StateContext.Provider
        value={useMemo(() => ({ search: { place, error }, selected }), [place, error, selected])}
      >
        {children}
      </StateContext.Provider>
    </StateMethodContext.Provider>
  )
}

export const usePlaceState = () => useContext(StateContext)
export const usePlaceMethod = () => useContext(StateMethodContext)

export default StateProvider
