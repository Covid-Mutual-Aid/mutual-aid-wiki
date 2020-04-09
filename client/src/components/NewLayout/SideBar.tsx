import React from 'react'
import styled from 'styled-components'

import SearchBox from './SearchBox'
import GroupsList from './GroupsList'

const SideBar = () => {
  return (
    <SideBarStyles>
      <h3>Find your local mutal aid group</h3>
      <SearchBox />
      <GroupsList />
    </SideBarStyles>
  )
}

const SideBarStyles = styled.div`
  height: 100%;
  overflow: hidden;
  box-shadow: 0px 0px 22px -9px #959595;
  position: relative;
  z-index: 2;
  display: flex;

  flex-flow: column;
  h3 {
    padding: 1rem;
    font-size: 3rem;
    font-weight: bold;
  }
`

export default SideBar
