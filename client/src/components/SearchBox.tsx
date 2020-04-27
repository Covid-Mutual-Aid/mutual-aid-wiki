import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useSearch } from '../contexts/SearchProvider'
import { useI18n } from '../contexts/I18nProvider'
import { selectGroup } from '../state/reducers/groups'

import useBrowserGeolocate from '../hooks/useBrowserGeolocate'
import { MOON_BLUE } from '../utils/CONSTANTS'
import icons from '../utils/icons'
import InputGroup from './Form/InputGroup'

const SearchBox = () => {
  const dispatch = useDispatch()
  const t = useI18n((locale) => locale.translation.components.search_box)
  const [searchInput, setSearchInput] = useState('')
  const geolocateUser = useBrowserGeolocate()
  const [onSearch, place] = useSearch()

  return (
    <Styles>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          if (searchInput.length > 1) {
            setSearchInput('')
            onSearch(searchInput)
            dispatch(selectGroup())
          }
        }}
      >
        <InputGroup>
          <input
            value={searchInput}
            placeholder={t.search_prompt}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="button-group">
            <button onClick={() => geolocateUser()}>{icons('nav')}</button>
            <button type="submit">{icons('search')}</button>
          </div>
        </InputGroup>
      </form>
      {place ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ padding: '0 1rem' }}>
            {t.place_name_label}: <b>{place.name}</b>{' '}
            <span
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => onSearch()}
            >
              clear
            </span>
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link to="/add-group">
            <p className="add-group">{t.add_prompt}</p>
          </Link>
        </div>
      )}
    </Styles>
  )
}

const Styles = styled.div`
  padding: 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  .clear {
    color: ${MOON_BLUE};
  }
  .add-group {
    padding: 0rem 0.2rem;
    margin-bottom: 1.2rem;
    color: ${MOON_BLUE};
    cursor: pointer;
  }
  .search {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #8a8686;
    color: white;
  }
  .button-group {
    display: flex;
    flex-direction: row;
  }
`

export default SearchBox
