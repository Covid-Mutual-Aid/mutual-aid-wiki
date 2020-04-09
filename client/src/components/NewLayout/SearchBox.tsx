import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSearch } from '../../contexts/SearchContext'
import { useGroups } from '../../contexts/GroupsContext'

const SearchBox = () => {
  const [search, setSearch] = useState('')
  const { onSearch, place } = useSearch()
  const { setSelected } = useGroups()
  return (
    <Styles>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSearch('')
          onSearch(search)
          setSelected(null)
        }}
      >
        <input
          value={search}
          placeholder="Enter place"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="add-group">
            Add Group
          </button>
          <button type="submit" className="search">
            search
          </button>
        </div>
      </form>
      <div>
        {place && (
          <>
            <div style={{ padding: '1rem 0' }}>
              show results nearest: <span style={{ fontWeight: 'bold' }}>{place.name}</span>
              <button type="button" className="clear" onClick={() => onSearch()}>
                clear
              </button>
            </div>
          </>
        )}
      </div>
    </Styles>
  )
}

const Styles = styled.div`
  padding: 0 1rem;
  margin-bottom: 2rem;
  input {
    width: 100%;
    outline: none;
    border: 1px solid black;
    background-color: transparent;
    padding: 0.5rem 1rem;
  }
  button {
    border: none;
    outline: none;
    background-color: transparent;
  }
  .clear {
    color: blue;
  }
  .add-group {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .search {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #8a8686;
    color: white;
  }
`

export default SearchBox
