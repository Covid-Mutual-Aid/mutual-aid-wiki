import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { usePlaceMethod, usePlaceState } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'

const SearchBox = () => {
  const [searchInput, setSearchInput] = useState('')
  const { onSearch, onSelect } = usePlaceMethod()
  const { search } = usePlaceState()
  return (
    <Styles>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSearchInput('')
          onSearch(searchInput)
          onSelect()
        }}
      >
        <input
          value={searchInput}
          placeholder="Enter place"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="search">
          search
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="add-group">Or add a group</p>
        </div>
      </form>
      <div>
        {search.place && (
          <>
            <div style={{ padding: '1rem 0' }}>
              show results nearest:{' '}
              <p style={{ fontWeight: 'bold' }}>
                {search.place.name} <span onClick={() => onSearch()}>clear</span>
              </p>
            </div>
          </>
        )}
      </div>
    </Styles>
  )
}

const Styles = styled.div`
  padding: 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  input {
    width: calc(100% - 8rem);
    outline: none;
    border: 1px solid black;
    border-radius: 4px;
    background-color: transparent;
    padding: 0.5rem 1rem;
  }
  button {
    width: 8rem;
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
    color: blue;
    cursor: pointer;
  }
  .search {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #8a8686;
    color: white;
  }
`

export default SearchBox
