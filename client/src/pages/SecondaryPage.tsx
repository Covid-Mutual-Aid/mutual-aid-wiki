import React, { ReactChild } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Nav from '../components/NewLayout/Nav'

import '../styles/new-layout.css'
import icons from '../utils/icons'

const SecondaryPage = ({ title, children }: { title: string; children: ReactChild }) => {
  return (
    <Wrapper>
      <div>
        <Nav>
          <Link to="/newlayout">{icons('chevronL')}</Link>
        </Nav>
        <h3>{title}</h3>
      </div>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 2.6rem;
  height: 100vh;
  overflow-x: scroll;

  h3 {
    padding: 2rem 1rem;
    font-size: 3rem;
    font-weight: 800;
  }
`

export default SecondaryPage
