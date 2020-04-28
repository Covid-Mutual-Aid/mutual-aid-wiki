import React, { createContext, useContext, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import useLocationSearch from '../hooks/useLocationSearch'
import { useLocationState, Location, setSearchLocation } from '../state/reducers/location'
import { useDispatch } from 'react-redux'

const SearchContext = createContext<[(x?: string) => void, null | string]>([() => null, null])

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const { search } = useLocation()
  const history = useHistory()
  const error = useLocationSearch(search.replace('?', ''))
  const onSearch = useCallback(
    (query?: string) => {
      if (!query) return history.replace(`?`)
      history.replace(`?${query}`)
      return void null
    },
    [history]
  )

  return <SearchContext.Provider value={[onSearch, error]}>{children}</SearchContext.Provider>
}

export const useSearch = (): [(x?: string) => void, Location | undefined, null | string] => {
  const dispatch = useDispatch()
  const [handleSearch, error] = useContext(SearchContext)
  const place = useLocationState().search

  const onSearch = (q?: string) => {
    if (!q) return dispatch(setSearchLocation())
    handleSearch(q)
  }
  return [onSearch, place, error]
}

export default SearchProvider
