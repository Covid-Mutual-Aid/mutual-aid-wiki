import React, { createContext, useEffect, useContext, useCallback, useMemo } from 'react'
import { useRequest } from './RequestProvider'
import useLocationSearch, { Place } from '../utils/useLocationSearchNew'
import { useLocation, useHistory } from 'react-router-dom'

const SearchContext = createContext<{
  onSearch: (x?: string) => void
  place: null | Place
  error: null | string
}>({ onSearch: (x?: string) => null, place: null, error: null })

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation()
  const history = useHistory()
  const request = useRequest()
  const { error, place } = useLocationSearch(search.replace('?', ''))

  const onSearch = useCallback((query?: string) => {
    if (!query) return history.replace(`?`)
    history.replace(`?${query}`)
    return void null
  }, [])

  return (
    <SearchContext.Provider
      value={useMemo(() => ({ onSearch, place, error }), [place, error, onSearch])}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)

export default SearchProvider
