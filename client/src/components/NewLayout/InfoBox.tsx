import React from 'react'
import { usePlaceState, usePlaceMethod } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'
import styled from 'styled-components'
import tidyLink from '../../utils/tidyLink'
import { iconFromUrl } from '../../utils/icons'
import GroupItem from './GroupItem'

const InfoBox = () => {
  const { groups } = useData()
  const { onSearch } = usePlaceMethod()
  const {
    search: { place },
    selected,
  } = usePlaceState()

  const selectedGroup = groups.find((x) => x.id === selected)
  return (
    <Wrapper isOpen={!!(place || selectedGroup)}>
      {place && (
        <div className={place ? 'open' : ''}>
          show results nearest: <span style={{ fontWeight: 'bold' }}>{place.name}</span>
          <button type="button" className="clear" onClick={() => onSearch()}>
            clear
          </button>
        </div>
      )}
      {selectedGroup && (
        <>
          <GroupItem selected={false} group={selectedGroup} onSelect={() => null} />
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: calc(50% - (18rem * 0.5));
  width: 18rem;
  box-shadow: 0px 0px 22px -9px #959595;
  margin: 1rem;
  padding: 1rem;
  z-index: 1;
  background-color: white;
  border-radius: 8px;
  transition: top 0.3s;
  top: ${(p) => (p.isOpen ? '0' : '-20rem')};

  h4 {
    font-size: 1.2rem;
  }

  & .open {
    top: 0;
  }
`

export default InfoBox
