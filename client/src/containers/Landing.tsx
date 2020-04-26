import { useLocation, Switch, Route } from 'react-router-dom'
import React, { useState } from 'react'
import styled from 'styled-components'

import Map from '../components/Maps'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import GroupsList from '../components/GroupsList'
import SidePannel from '../components/SidePannel'
import SearchBox from '../components/SearchBox'
import CreateGroup from './Create'
import EditGroup from './Edit'
import inIframe from '../utils/inIframe'
import { useI18n } from '../contexts/I18nProvider'

export type PannelState = 'pannel' | 'edit'

const MapLayout = () => {
  const t = useI18n((locale) => locale.translation.pages.groups)
  const [open, setOpen] = useState(true)
  const { pathname } = useLocation()
  const pannelState = pathname === '/' ? 'pannel' : 'edit'

  return (
    <LayoutStyles state={pannelState} open={open}>
      <SidePannel state={pannelState} open={open} toggle={() => setOpen(!open)}>
        <Switch>
          <Route path="/edit/:id/:token" component={EditGroup} />
          <Route path="/add-group" component={CreateGroup} />
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
              {inIframe() ? (
                <div style={{ height: '1rem' }}></div>
              ) : (
                <h3>
                  {t.cta.line1} <br className="break" /> {t.cta.line2}
                </h3>
              )}
            </div>
            <SearchBox />
            <GroupsList
              closeSidebar={() => (window.innerWidth < MOBILE_BREAKPOINT ? setOpen(false) : null)}
            />
          </Route>
        </Switch>
      </SidePannel>
      <Map />
    </LayoutStyles>
  )
}

export default MapLayout

const LayoutStyles = styled.div<{ state: PannelState; open: boolean }>`
  display: grid;
  grid: 100% / ${(p) => {
    if (!p.open) return '1rem'
    if (p.state === 'pannel') return '30rem'
    return '50vw'
  }} 1fr;
  height: 100vh;
  transition: grid 0.3s;
  }
  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    grid: 100% / ${(p) => (p.open ? '100vw' : '1rem')} 1fr;
  }
`
