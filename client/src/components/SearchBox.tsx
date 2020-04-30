import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useSearch } from '../contexts/SearchProvider'
import { useI18n } from '../contexts/I18nProvider'
import { selectGroup, useGroupsList } from '../state/reducers/groups'

import useBrowserGeolocate from '../hooks/useBrowserGeolocate'
import { MOON_BLUE } from '../utils/CONSTANTS'
import icons from './icons'
import InputGroup from './Form/InputGroup'
import inIframe from '../utils/inIframe'

const SearchBox = () => {
  const dispatch = useDispatch()
  const t = useI18n((locale) => locale.translation.components.search_box)
  const [searchInput, setSearchInput] = useState('')
  const geolocateUser = useBrowserGeolocate()
  const [onSearch, place] = useSearch()
  const groups = useGroupsList()

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
            {!inIframe() && (
              <button onClick={() => geolocateUser()} type="button">
                {icons('nav')}
              </button>
            )}
            <button type="submit">{icons('search')}</button>
          </div>
        </InputGroup>
      </form>
      {place ? (
        <div
          style={{
            position: 'relative',
            margin: '0rem 1rem 1rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ margin: 0 }}>
            {t.place_name_label}: <br />
            <b>{place.name}</b>{' '}
            <span
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                color: 'blue',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
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
          <Link to="/map/add-group">
            <b>
              <p className="add-group">{t.add_prompt}</p>
            </b>
          </Link>
          <div>
            <b>( {groups.length} )</b>
          </div>
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
    margin-top: 0rem;
    margin-bottom: 1.2rem;
    color: ${MOON_BLUE};
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.2rem;
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
