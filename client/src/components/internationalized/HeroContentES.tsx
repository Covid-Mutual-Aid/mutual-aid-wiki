import React from 'react'
import {Link} from 'react-router-dom'
const HeroContentES = () => {

  return (
    <div className="hero-content">
      <h1>Mutual Aid Wiki</h1>
      <p>Un recurso gestionado por la communidad que documenta los grupos de apoyo mutuo en todo el mundo.</p>
      <p>
        Creado para habilitar a individuos a connectar con sus communidades de apoyo mutuo, y para habilitar a communidades de apoyo mutuo encontrar el uno a otro, compartir enfoques, y apoyar el uno a otro.
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
