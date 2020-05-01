import React from 'react'
import {Link} from 'react-router-dom'
const HeroContentES = () => {

  return (
    <div className="hero-content">
      <h1>Mutual Aid Wiki</h1>
      <p>Un recurso gestionado por la comunidad que registra los grupos de apoyo mutuo en todo el mundo.</p>
      <p>
        Creado para ayudar a individuos a connectar con sus communidades de apoyo mutuo y también para ayudar a communidades de apoyo mutuo a encontrarse, compartir enfoques y apoyarse.
      </p>
      <div className="buttons">
        <Link to="/map">
          <button className="btn-primary">Visita el mapa</button>
        </Link>
      </div>
    </div>
  )
}

export default HeroContentES
