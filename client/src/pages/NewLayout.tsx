import React, { useReducer } from 'react'
import styled from 'styled-components'

import Map from '../components/NewLayout/Map'
import SearchBox from '../components/NewLayout/SearchBox'
import GroupsList from '../components/NewLayout/GroupsList'
import InfoBox from '../components/NewLayout/InfoBox'

const NewLayout = () => {
  const [open, toggleSidebar] = useReducer((x) => !x, true)
  return (
    <LayoutStyles sidebar={open}>
      <div className="side-bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>Find your local mutal aid group</h3>
          <button onClick={toggleSidebar} className="toggle" />
        </div>
        <SearchBox />
        <GroupsList />
      </div>
      <div className="map-container">
        <div className="info-box">
          <InfoBox />
        </div>
        <Map />
      </div>
    </LayoutStyles>
  )
}

const LayoutStyles = styled.div<{ sidebar: boolean }>`
  display: grid;
  grid: 1fr / ${(p) => (p.sidebar ? '25rem' : '4rem')} 1fr;
  height: 100vh;
  transition: grid 0.3s;
  .side-bar {
    width: 25rem;
    transition: padding-right transform 0.3s;
    transform: translateX(${(p) => (p.sidebar ? '0rem' : '-21rem')});
    padding-right: ${(p) => (p.sidebar ? '0rem' : '4rem')};
    height: 100%;
    overflow: hidden;
    box-shadow: 0px 0px 22px -9px #959595;
    background-color: white;
    position: relative;
    z-index: 2;
    display: flex;
    flex-flow: column;
    h3 {
      padding: 1rem;
      font-size: 3rem;
      font-weight: bold;
    }
    .toggle {
      border: none;
      outline: none;
      width: 2rem;
      height: 2rem;
      padding: 1rem;
      margin: 1rem;
      background-color: blue;
      transition: transform 0.3s;
      transform: translateX(${(p) => (p.sidebar ? '0rem' : '4rem')});
    }
  }
  .map-container {
    display: grid;
    grid: 0fr 1fr / 1fr;
    .info-box {
      width: 100%;
      height: 4rem;
      background-color: white;
      box-shadow: 0px 0px 22px -9px #959595;
    }
  }
`

const SideBarStyles = styled.div``

export default NewLayout
