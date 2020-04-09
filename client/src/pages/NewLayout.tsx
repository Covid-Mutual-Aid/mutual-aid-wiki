import React from 'react'
import styled from 'styled-components'
import SideBar from '../components/NewLayout/SideBar'
import Map from '../components/NewLayout/Map'

const NewLayout = () => {
  return (
    <LayoutStyles>
      <SideBar />
      <Map />
    </LayoutStyles>
  )
}

const LayoutStyles = styled.div`
  display: grid;
  grid: 1fr / 25rem 1fr;
  height: 100vh;
`

export default NewLayout
