import React, { ReactChild } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { MOON_BLUE } from '../../utils/CONSTANTS'

const Nav = ({ children }: { children?: ReactChild }) => {
  return (
    <NavWrapper>
      <div className="options">
        <Link to="/about">INFORMATION</Link>
        <Link to="/help">?</Link>
      </div>
      <div className="buttons-right">{children}</div>
    </NavWrapper>
  )
}

const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  flex-basis: center;
  color: rgba(0, 0, 0, 0.6);
  justify-content: space-between;
  align-items: start;
  padding: 0.2rem 0.4rem;

  .options {
    display: flex;
    flex-direction: row;
    height: 1.8rem;

    a {
      border-radius: 6px;
      border: 1px solid ${MOON_BLUE};
      padding: 0 0.8rem;
      margin: 0 0.2rem;
      color: ${MOON_BLUE};

      text-decoration: none;
      line-height: 1.6;
    }
  }

  .buttons-right {
  }
`

export default Nav
