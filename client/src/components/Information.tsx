import { Link, useLocation, useHistory } from 'react-router-dom'
import React, { useLayoutEffect } from 'react'
import styled from 'styled-components'

import { useGroupsList } from '../state/reducers/groups'
import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
import { useI18n } from '../contexts/I18nProvider'
import inIframe from '../utils/inIframe'
import icons from './icons'

import info_add from './img/info_add.png'
import info_edit from './img/info_edit.png'
import info_embed from './img/info_embed.png'

const Information = () => {
  const history = useHistory()
  const { pathname, search } = useLocation()
  const aboutInformation = useI18n((locale) => locale.components.about)
  const groups = useGroupsList()

  useLayoutEffect(() => {
    if (inIframe() && pathname === '/') {
      history.replace('/map/' + search)
    }
  }, [pathname, history])

  return (
    <LandingStyles open={pathname === '/'}>
      <Hero>
        <div className="hero-content">
          <h1>Mutual Aid Wiki</h1>
          <p>A community mananged resource documenting mutual aid groups throughout the world.</p>
          <p>
            Created to enable individuals to connect with their mutual aid communities and to enable
            mutual aid communities find each other, share approaches and support one another.
          </p>
          <div className="buttons">
            <Link to="/map">
              <button className="btn-primary">Visit the Map</button>
            </Link>
          </div>
        </div>
      </Hero>
      <Highlight>
        <div className="wrapper">
          <div>
            {icons('git')}
            <h3>Open Source</h3>
            <p>
              All of our code is published with an open source license. We accept pull requests and
              actively rely on the work of volunteers to maintain this project.
            </p>
          </div>
          <div>
            {icons('users')}
            <h3>Community Created</h3>
            <p>
              We are developing this resource together with organising groups from all over the
              world to make sure that this data is used for the benefit of the global mutual aid
              community.
            </p>
          </div>
          <div>
            {icons('globe')}
            <h3>{groups.length} Communities</h3>
            <p>
              This resource currently documents {groups.length} groups from around the world, with
              new groups being added daily. Please get in touch if you would like to sync your data.
            </p>
          </div>
        </div>
      </Highlight>

      <Feature tint={'rgb(244, 250, 255)'}>
        <div className="wrapper">
          <div className="description">
            <h1>Add your group</h1>
            <h3>
              Add your group to the map immediately. You can specify your group's location by
              dropping a marker or defining a perimeter.
            </h3>
          </div>
          <div className="spacer"></div>
          <div className="image info_add"></div>
        </div>
      </Feature>
      <Feature tint={'rgb(255, 255, 255)'}>
        <div className="wrapper">
          <div className="image info_edit"></div>
          <div className="spacer"></div>
          <div className="description">
            <h1>Edit your group</h1>
            <h3>
              Edit your groups information with the email used to create it, or verify your email
              with an existing group to edit it.
            </h3>
          </div>
        </div>
      </Feature>
      <Feature tint={'rgba(0, 0, 0, 0.8)'}>
        <div className="wrapper">
          <div className="description white">
            <h1>Embed this map</h1>
            <h3>
              To get the functionality of this map on your website, just paste the the following
              code into your page. We are happy to help if you're not sure.
            </h3>
            <code>{`<iframe `}</code>
            <br />
            <code>&nbsp;{`src="https://mutualaid.wiki">`}</code>
            <br />
            <code>{`</iframe>`}</code>
          </div>
          <div className="spacer"></div>
          <div className="image info_embed"></div>
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

const Feature = styled.div<{ tint: string }>`
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

  .image {
    height: 20rem;
    min-width: 30rem;
    border-radius: 6px;
    box-shadow: 0px 0px 22px -9px #959595;
    border: 1px solid rgb(225, 225, 225);
    background-size: contain;
    background-color: transparent;
  }

  .info_add {
    background-image: url(${info_add});
  }

  .info_edit {
    background-image: url(${info_edit});
  }

  .info_embed {
    background-image: url(${info_embed});
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

    .image {
      order: 1;
      width: 30rem;
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
