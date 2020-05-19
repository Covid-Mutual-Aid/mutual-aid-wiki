import React from 'react'
import { Link } from 'react-router-dom'

const HeroContentEN = () => {
  return (
    <div className="hero-content">
      <h1>Mutual Aid Wiki</h1>
      <p>A community managed resource documenting mutual aid groups throughout the world.</p>
      <p>
        Created to enable individuals to connect with their mutual aid communities and to enable
        mutual aid communities to find each other, share approaches and support one another.
      </p>
      <div className="buttons">
        <Link to="/map">
          <button className="btn-primary">Visit the Map</button>
        </Link>
      </div>
    </div>
  )
}

export default HeroContentEN
