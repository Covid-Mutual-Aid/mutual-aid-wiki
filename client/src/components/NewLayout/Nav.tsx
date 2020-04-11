import React, { ReactChild } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Nav = ({ children }: { children?: ReactChild }) => {
  return (
    <NavWrapper>
      <div className="options">
        <Link to="/about">ABOUT</Link>
        <Link to="/help">HELP</Link>
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
  align-items: center;

  .options {
    display: flex;
    flex-direction: row;
    height: 1.8rem;

    a {
      border-radius: 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0 1rem;
      margin: 0 0.2rem;
      color: grey;
      text-decoration: none;
    }
  }

  .buttons-right {
  }
`

export default Nav
