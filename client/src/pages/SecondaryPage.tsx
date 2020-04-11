import React, { ReactChild } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Nav from '../components/NewLayout/Nav'

import '../styles/new-layout.css'
import icons from '../utils/icons'

const SecondaryPage = ({ title, children }: { title: string; children: ReactChild }) => {
  const list = [
    'Who made this',
    'Is my data secure',
    'Is this Open Source',
    'How can I edit my data',
    'Can I remove my data',
    'How can I prevent people spamming my group',
    'Report a group',
    'Add language translations',
  ]
  return (
    <Page>
      <div className="wrapper">
        <div className="nav-contents">
          <Nav>
            <Link to="/newlayout">{icons('chevronL')}</Link>
          </Nav>
          <h3>{title}</h3>
          <div className="section-list">
            {list.map((t, i) => (
              <p>{t}</p>
            ))}
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </Page>
  )
}

const Page = styled.div`
  padding: 2.6rem 2rem;
  height: 100vh;
  overflow-x: scroll;
  display: flex;
  justify-content: center;

  .wrapper {
    display: flex;
    flex-direction: row;
    max-width: 64rem;
  }

  .nav-contents {
    min-width: 24rem;
    padding: 0 4rem;
    position: sticky;
    top: 0;
    align-self: flex-start;
  }

  .section-list {
    /* font-family: 'Source Serif Pro', serif; */
    margin-top: 2.6rem;
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
  }

  .content {
    font-size: 1.12rem;
    font-weight: 500;

    padding: 0 2rem;
    padding-top: 12rem;

    p {
      font-family: 'Source Serif Pro', serif;
      padding: 2rem 0;
    }
  }

  h3 {
    padding: 2rem 1rem;
    font-size: 3rem;
    font-weight: 800;
  }

  @media (max-width: 900px) {
    .wrapper {
      max-width: 40rem;
      justify-content: flex-start;
      flex-direction: column;
    }

    .content {
      padding-top: 2rem;
    }

    .nav-contents {
      min-width: 100%;
      position: relative;
      padding: 0 2rem;
    }

    .content-wrapper {
      padding-top: 2rem;
    }

    .nav-contents > * {
      flex: 1 1 160px;
    }

    .section-list {
      flex-wrap: wrap;
      column-count: 2;
      margin-top: 0rem;
    }
  }
`

export default SecondaryPage
