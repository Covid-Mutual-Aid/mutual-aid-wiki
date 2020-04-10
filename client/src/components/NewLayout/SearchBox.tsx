import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { usePlaceMethod, usePlaceState } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'
import icons from '../../utils/icons'

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
        <SearchGroup>
          <input
            value={searchInput}
            placeholder="Enter place"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">{icons('search')}</button>
        </SearchGroup>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="add-group">Or add a group</p>
      </div>
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

const SearchGroup = styled.div`
  height: 2.8rem;
  border: 1px solid black;
  border-radius: 20px;
  overflow: hidden;

  input:focus {
    outline: none;
  }

  input,
  button {
    height: 100%;
  }

  input {
    width: calc(100% - 8rem);
    outline: none;
    border: none;
    background-color: transparent;
    padding: 0.5rem 1rem;
  }
  button {
    height: 2.8rem;
    width: 8rem;
    padding: 0;
    border: none;
    outline: none;
    background-color: blue;
    color: white;
  }
`

const Styles = styled.div`
  padding: 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

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