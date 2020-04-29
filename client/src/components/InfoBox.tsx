import React from 'react'
import styled from 'styled-components'

import { useSelectedGroup } from '../state/reducers/groups'
import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import isIosSafari from '../utils/isIosSafari'
import GroupItem from './GroupItem'
import DropDown from './DropDown'

const InfoBox = () => {
  const selected = useSelectedGroup()
  return (
    <Wrapper isOpen={!!selected}>
      {selected && <GroupItem group={selected} highlight={false} />}
      {selected && <DropDown />}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  left: calc(50% - (22rem * 0.5));
  width: 18rem;
  box-shadow: 0px 0px 22px -9px #959595;
  background-color: white;
  margin: 4rem 0;
  padding: 1rem;
  z-index: 1;
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
