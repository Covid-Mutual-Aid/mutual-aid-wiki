import React, { createContext, useContext, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import useLocationSearch, { Place } from '../utils/useLocationSearchNew'

const SearchContext = createContext<[(x?: string) => void, Place | null, null | string]>([
  () => null,
  null,
  null,
])

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation()
  const history = useHistory()
  const [place, error] = useLocationSearch(search.replace('?', ''))

  const onSearch = useCallback(
    (query?: string) => {
      if (!query) return history.replace(`?`)
      history.replace(`?${query}`)
      return void null
    },
    [history]
  )

  return (
    <SearchContext.Provider value={[onSearch, place, error]}>{children}</SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)

export default SearchProvider
