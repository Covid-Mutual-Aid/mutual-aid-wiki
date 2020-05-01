import { useLocation, Switch, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import { useSideBar } from '../state/reducers/layout'
import inIframe from '../utils/inIframe'

import GroupsList from '../components/GroupsList'
import SidePannel from '../components/SidePannel'
import SearchBox from '../components/SearchBox'
import Map from '../components/Maps'

import CreateGroup from './Create'
import EditGroup from './Edit'

export type PannelState = 'pannel' | 'edit'

const Landing = () => {
  const [open, toggleSideBar] = useSideBar()
  const { pathname } = useLocation()

  const pannelState = /(add-group)|(edit\/.*?\/.{1,}?$)/.test(pathname) ? 'edit' : 'pannel'

  useEffect(() => {
    toggleSideBar(pathname !== '/')
  }, [pathname, toggleSideBar])

  return (
    <LayoutStyles state={pannelState} open={open}>
      <SidePannel state={pannelState}>
        <Switch>
          <Route path="/map/edit/:id/:token" component={EditGroup} />
          <Route path="/map/add-group" component={CreateGroup} />
          <Route path="/">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginTop: '-1rem',
                padding: '0rem 1rem 1rem 1rem',
              }}
            >
              {inIframe() ? <div style={{ height: '1rem' }}></div> : <span></span>}
            </div>
            <SearchBox />
            <GroupsList
              closeSidebar={() =>
                window.innerWidth < MOBILE_BREAKPOINT ? toggleSideBar(false) : null
              }
            />
          </Route>
        </Switch>
      </SidePannel>
      <Map />
    </LayoutStyles>
  )
}

export default Landing

const LayoutStyles = styled.div<{ state: PannelState; open: boolean }>`
  display: grid;
  grid: 100% / ${(p) => {
      if (!p.open) return '1rem'
      if (p.state === 'pannel') return '30rem'
      return '50vw'
    }} 1fr;
  height: 100vh;
  width: 100vw;
  transition: grid 0.3s;
  overflow: hidden;

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    grid: 100% / ${(p) => (p.open ? '100vw 0rem' : '1rem 1fr')};
  }
`
