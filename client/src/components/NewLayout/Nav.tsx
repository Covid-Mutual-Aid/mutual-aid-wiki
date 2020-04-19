import React, { ReactChild } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { MOON_BLUE } from '../../utils/CONSTANTS'
import inIframe from '../../utils/inIframe'

const Nav = ({ children }: { children?: ReactChild }) => {
  return (
    <NavWrapper>
      <div className="options">
        {inIframe() ? (
          <a target="_blank" href="https://mutualaid.wiki">
            View full site!
          </a>
        ) : (
          <Link to="/about">What is this?</Link>
        )}
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
      /* border: 1px solid ${MOON_BLUE}; */
      padding: 0 0.8rem 0 0;
      margin: 0 0.2rem;
      color: rgb(204, 39, 109);

      line-height: 1.6;
    }
  }

  .buttons-right {
  }
`

export default Nav
