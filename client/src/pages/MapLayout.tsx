import React, { useState } from 'react'
import styled from 'styled-components'

import Map from '../components/Maps'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import SearchBox from '../components/SearchBox'
import GroupsList from '../components/GroupsList'
import SidePannel from '../components/SidePannel'

const MapLayout = () => {
  const [open, setOpen] = useState(true)

  return (
    <LayoutStyles sidebar={open}>
      <SidePannel open={open} toggle={() => setOpen(!open)}>
        <SearchBox />
        <GroupsList
          closeSidebar={() => (window.innerWidth < MOBILE_BREAKPOINT ? setOpen(false) : null)}
        />
      </SidePannel>
      <Map />
    </LayoutStyles>
  )
}

export default MapLayout

const LayoutStyles = styled.div<{ sidebar: boolean }>`
  display: grid;
  grid: 100% / ${(p) => (p.sidebar ? '30rem' : '1rem')} 1fr;
  height: 100vh;
  transition: grid 0.3s;
  }
  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    grid: 100% / ${(p) => (p.sidebar ? '100vw' : '1rem')} 1fr;
  }
`
