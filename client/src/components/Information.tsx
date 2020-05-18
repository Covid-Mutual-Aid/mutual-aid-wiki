import { useLocation, useHistory } from 'react-router-dom'
import React, { useLayoutEffect } from 'react'
import styled from 'styled-components'

import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import { useI18n } from '../contexts/I18nProvider'
import inIframe from '../utils/inIframe'

import info_add from './img/info_add.png'
import info_edit from './img/info_edit.png'
import info_embed from './img/info_embed.png'

const Information = () => {
  const history = useHistory()
  const { pathname, search } = useLocation()
  const localizedComponents = useI18n((x) => x.components)
  const aboutInformation = localizedComponents.about
  const heroContent = localizedComponents.heroContent
  const highlightsContent = localizedComponents.highlightsContent
  const addGroupContent = localizedComponents.addGroupContent
  const editGroupContent = localizedComponents.editGroupContent
  const embedMapContent = localizedComponents.embedMapContent
  const sourcesContent = localizedComponents.sourcesContent

  useLayoutEffect(() => {
    if (inIframe() && pathname === '/') {
      history.replace('/map/' + search)
    }
  }, [pathname, history, search])

  return (
    <LandingStyles open={pathname === '/'}>
      <Hero>{heroContent}</Hero>
      <Highlight>{highlightsContent}</Highlight>

      <Feature tint={'rgb(244, 250, 255)'}>
        <div className="wrapper">
          {addGroupContent}
          <div className="spacer"></div>
          <div className="img">
            <img alt="Add a group" src={info_add} />
          </div>
        </div>
      </Feature>
      <Feature tint={'rgb(255, 255, 255)'}>
        <div className="wrapper">
          <div className="img">
            <img alt="Edit a group" src={info_edit} />
          </div>
          <div className="spacer"></div>
          {editGroupContent}
        </div>
      </Feature>
      <Feature tint={'rgb(244, 250, 255)'}>
        <div className="wrapper full">
          <div className="description">{sourcesContent}</div>
          <div className="spacer"></div>
          <div className="img">
            <iframe
              title="Sources"
              className="airtable-embed"
              src="https://airtable.com/embed/shrgJ4OdI7KBMWVqj?backgroundColor=green"
              frameBorder="0"
              width="100%"
              height="320"
              style={{ background: 'transparent; border: 1px solid #ccc' }}
            ></iframe>
          </div>
        </div>
      </Feature>
      <Feature tint={'rgba(0, 0, 0, 0.8)'}>
        <div className="wrapper">
          <div className="description white">
            {embedMapContent}
            <code>{`<iframe `}</code>
            <br />
            <code>&nbsp;{`src="https://mutualaid.wiki">`}</code>
            <br />
            <code>{`</iframe>`}</code>
          </div>
          <div className="spacer"></div>
          <div className="img">
            <img alt="Embed a group" src={info_embed} />
          </div>
        </div>
      </Feature>
      <FAQ>
        <div className="wrapper">
          <div className="title">
            <h1>FAQ</h1>
          </div>
          {aboutInformation}
        </div>
      </FAQ>
    </LandingStyles>
  )
}

export default Information

const LandingStyles = styled.div<{ open: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  transform: translate3d(0, ${(p) => (!p.open ? '100vh' : '0')}, 0);
  visibility: ${(p) => (p.open ? 'inherit' : 'hidden')};
  z-index: 3;
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform 0.4s;
`

const Hero = styled.div`
  position: relative;
  display: flex;
  background-color: rgba(0, 0, 0, 0.74);
  height: calc(24rem + 12vw);
  justify-content: center;
  align-items: center;

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }

  .hero-content {
    width: 30rem;
    padding: 1rem;
    color: white;
  }

  .buttons a {
    display: block;
    margin: 1rem 1rem 0 0;
  }

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    height: calc(24rem + 32vh);
  }
`

const Highlight = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 0;
  background-color: white;

  .wrapper {
    justify-content: space-evenly;
    width: 72rem;
    display: flex;
    flex-direction: row;
    padding: 2rem 0;

    div {
      width: 16rem;
      padding: 1rem;

      p {
        color: rgb(87, 87, 87);
      }
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    padding: 1rem 0;
    .wrapper {
      flex-direction: column;
      div {
        width: 100%;
      }
    }
  }
`

const Feature = styled.div<{ tint: string; full?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 4rem 0;
  background-color: ${(p) => p.tint};

  .white {
    color: white;
  }

  .wrapper {
    padding: 1rem;
    max-width: 60rem;
    display: flex;
    flex-direction: row;
  }

  .description {
    h3 {
      color: rgb(138, 138, 138);
    }
  }

  .spacer {
    width: 6rem;
  }

  .img {
    position: relative;
    height: 20rem;
    min-width: 30rem;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 6px;
    box-shadow: 0px 0px 22px -9px #959595;
    border: 1px solid rgb(225, 225, 225);
    background-size: contain;
    background-color: transparent;
    background-repeat: no-repeat;
  }

  .full {
    flex-wrap: wrap;

    .img {
      min-width: 100%;
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT + 120 + 'px'}) {
    code {
      font-size: 0.72rem;
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
    padding: 1rem;

    .wrapper {
      flex-direction: column;
    }

    .img {
      order: 1;
      min-width: 100%;
      height: 100%;
    }

    .description {
      order: 2;
      code {
        font-size: 1rem;
      }
    }
    .spacer {
      display: none;
    }
  }
`

const FAQ = styled.div`
  padding: 1rem;
  background-color: white;
  display: flex;
  justify-content: center;

  .title {
    text-align: center;
    padding: 1rem 0;
  }
  .wrapper {
    max-width: 38rem;
    li {
      font-size: 1.2rem;
    }
  }
`
