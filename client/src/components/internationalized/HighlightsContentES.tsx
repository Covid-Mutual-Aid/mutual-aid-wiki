import React from 'react'
import icons from '../icons'
import { useGroupsList } from '../../state/reducers/groups'

const HighlightsContentEN = () => {
  const groups = useGroupsList()
  return (
    <div className="wrapper highlights-content">
      <div>
        {icons('git')}
        <h3>Código abierto</h3>
        <p>
          Todo nuestro código está publicado con una licencia de código abierto. Aceptamos 'pull requests' y
          confiamos activamente en el trabajo de voluntarios para mantener este proyecto.
        </p>
      </div>
      <div>
        {icons('users')}
        <h3>Creado por la comunidad</h3>
        <p>
          Estamos desarollando este recurso juntos con grupos organizadores de todo el mundo, para asegurarnos que estes datos estan usado en beneficio de la comunidad global de apoyo mutuo.
        </p>
      </div>
      <div>
        {icons('globe')}
        <h3>{groups.length} comunidades</h3>
        <p>
          Actualmente, este recurso documenta a {groups.length} grupos de todo el mundo, con nuevos grupos que se agregen diariamente. Ponte en contacto si quieres sincronizar tus datos.
        </p>
      </div>
    </div>
  )
}

export default HighlightsContentEN
