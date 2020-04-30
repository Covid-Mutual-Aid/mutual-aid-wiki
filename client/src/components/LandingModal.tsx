import React from 'react'
import styled from 'styled-components'
import icons from '../utils/icons'
import { useGroupsList } from '../state/reducers/groups'
import { Link } from 'react-router-dom'

const LandingModal = ({ open }: { open: boolean }) => {
  const groups = useGroupsList()
  return (
    <LandingStyles open={open}>
      <Hero>
        <div className="hero-content">
          <h1>Mutual Aid Wiki</h1>
          <p>
            We believe communities know what is best for themselves and that communities share many
            common challenges.
          </p>
          <p>
            We hope that by creating this resource, we enable individuals to connect with their
            mutual aid communities and enable mutual aid communities find each other, share
            approaches and support one another.
          </p>
          <div className="buttons">
            <Link to="/">
              <button className="btn-primary">Visit the Map</button>
            </Link>
            <Link to="/about">
              <button className="btn-secondary">More information</button>
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
              We are developing this resource together with organising groups in the UK and the US
              to make sure that this data is used for the benefit of the global mutual aid
              community.
            </p>
          </div>
          <div>
            {icons('globe')}
            <h3>{groups.length} Groups</h3>
            <p>
              We have {groups.length} groups from around the world, with new groups being added
              daily. Please get in touch if you would like to sync your data with this resouce.
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
          <div className="image">
            <div className="image-placeholder"></div>
          </div>
        </div>
      </Feature>
      <Feature tint={'rgb(255, 255, 255)'}>
        <div className="wrapper">
          <div className="image">
            <div className="image-placeholder"></div>
          </div>
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
      <Feature tint={'rgb(244, 250, 255)'}>
        <div className="wrapper">
          <div className="description">
            <h1>Embed this map</h1>
            <h3>
              To get the functionality of this map on your website, just paste the embed code into
              your page. We are happy to help if you're not sure.
            </h3>
          </div>
          <div className="spacer"></div>
          <div className="image">
            <div className="image-placeholder"></div>
          </div>
        </div>
      </Feature>
    </LandingStyles>
  )
}

export default LandingModal

const LandingStyles = styled.div<{ open: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  transform: translate3d(0, ${(p) => (!p.open ? '100vh' : '0')}, 0);
  z-index: 3;
  overflow-y: auto;
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
    margin-right: 1rem;
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
`

const Feature = styled.div<{ tint: string }>`
  display: flex;
  justify-content: center;
  padding: 4rem 0;
  background-color: ${(p) => p.tint};

  .wrapper {
    max-width: 60rem;
    display: flex;
    flex-direction: row;
  }

  .spacer {
    width: 6rem;
  }

  .image-placeholder {
    background-color: lightgray;
    height: 20rem;
    width: 30rem;
  }
`
