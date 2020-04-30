import React from 'react'
import styled from 'styled-components'
import icons from '../utils/icons'
import useEditLocationMap from './Maps/hooks/useEditLocationMap'

const Landing = () => {
  return (
    <LandingStyles>
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
          <button className="btn-primary">Visit the Map</button>
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
            <h3>3.5k Groups and counting</h3>
            <p>
              We have just over 3.5k groups from around the world, with new groups being added
              daily. Please get in touch if you would like to sync your data with this resouce.
            </p>
          </div>
        </div>
      </Highlight>
      <Feature>
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
      <Feature>
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
      <Feature>
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

export default Landing

const LandingStyles = styled.div`
  height: 100vh;
  overflow-y: auto;
`

const Hero = styled.div`
  position: relative;
  display: flex;
  background-color: rgba(0, 0, 0, 0.8);
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
`

const Highlight = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 0;

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

const Feature = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 0;
  background-color: rgba(0, 0, 255, 0.03);

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
