import React from 'react'
import styled from 'styled-components'

import { usePlaceState } from '../../contexts/StateContext'
import { useData } from '../../contexts/DataProvider'
import GroupItem from './GroupItem'

import { MOBILE_BREAKPOINT } from '../../utils/CONSTANTS'
import isIosSafari from '../../utils/isIosSafari'

const InfoBox = () => {
  const { groups } = useData()
  const { selected } = usePlaceState()

  const selectedGroup = groups.find((x) => x.id === selected)
  return (
    <Wrapper isOpen={!!selectedGroup}>
      {/* {place && (
        <div className={place ? 'open' : ''}>
          show results nearest: <span style={{ fontWeight: 'bold' }}>{place.name}</span>
          <button type="button" className="clear" onClick={() => onSearch()}>
            clear
          </button>
        </div>
      )} */}
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
  left: calc(50% - (22rem * 0.5));
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

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    top: initial;
    bottom: ${(p) => (p.isOpen ? '0' : '-20rem')};
    margin-bottom: ${(p) => (isIosSafari() ? '8rem' : '2rem')};
    transition: bottom 0.3s;

    & .open {
      bottom: 0;
    }
  }
`

export default InfoBox
