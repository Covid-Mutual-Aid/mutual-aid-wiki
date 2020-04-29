import React from 'react'
import styled from 'styled-components'

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
            mutual aid communities and enable mutual aid communities connect with each other.
          </p>
          <p>
            We hope that this resource helps communities share approaches and support one another.
          </p>
          <button className="btn-primary">Visit the Map</button>
        </div>
      </Hero>
      <Highlight>
        <div className="wrapper">
          <div>
            <h3>Open Source</h3>
            <p>
              All of our code is published publicly with an open source license. We accept pull
              requests and actively rely on the work of volunteers to maintain this project.
            </p>
          </div>
          <div>
            <h3>Community Run</h3>
            <p>
              We hope that by creating this resource, we enable individuals to connect with their
              mutual aid communities and enable mutual aid communities connect with each other.
            </p>
          </div>
          <div>
            <h3>Over 3.5k Groups</h3>
            <p>
              We hope that by creating this resource, we enable individuals to connect with their
              mutual aid communities and enable mutual aid communities connect with each other.
            </p>
          </div>
        </div>
      </Highlight>
      <Feature>
        <div className="wrapper">
          <div className="description">
            <h1>Add and edit your group</h1>
          </div>
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
          <div className="description">
            <h1>Add and edit your group</h1>
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
  display: flex;
  background-color: grey;
  height: calc(24rem + 12vw);
  justify-content: center;
  align-items: center;

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
  padding: 2rem 0;

  .wrapper {
    max-width: 60rem;
    display: flex;
    flex-direction: row;
  }

  .image-placeholder {
    background-color: grey;
    height: 20rem;
    width: 40rem;
  }
`
