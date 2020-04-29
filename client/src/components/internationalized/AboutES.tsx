import React from 'react'
import icons from '../icons'

const AboutES = () => {
  return (
    <div>
      <h2>Un mapa global de grupos de apoyo mutuo COVID-19</h2>
      <p>
        ¿Tienes una lista de grupos o quieres traducir este sitio? Mandanos un{' '}
        <a href="mailto:info@mutualaid.wiki">correo</a>, nos encantará saber de ti.
      </p>
      <br />

      <p>Preguntas frecuentes:</p>
      <ul>
        <li>¿Puedo cambiar mi información de grupo?</li>
        <p>
          ¡Si! Busca tu grupo en el menú de la izquierda, haz click sobre el icono {icons('more')}{' '}
          arriba a la derecha y elige 'Editar grupo' en el menu despegable. Completa tu correo y
          revisa tu bandeja de entrada para más instrucciones 🙂.{' '}
        </p>
        <li>¿Puedo denunciar un grupo?</li>
        <p>
          Si, haz click sobre el icono {icons('more')} arriba a la derecha y elige 'Denuncia grupo
          en el menu despegable. Cuando hayas completado el modelo, revisaremos tu informe y
          eliminaremos el grupo si lo consideramos apropiado. Normalmente eliminamos el grupo si es
          un enlace a un individuo, spam, o una pagina promocional. También si ya no está accessible
          o difunde discursos de odio o desinformación.
        </p>
        <li>¿Son mis datos personales seguros?</li>
        <p>
          Aunque la información de tu grupo sea publica, los correos electronicos no lo serán. Nos
          importa mucho la privacidad y no revelaremos esto sin tu consentimiento de forma escrita.
        </p>
        <li>¿Podéis ayudarme a buscar mi grupo?</li>
        <p>
          Si nos mandas un correo intentaremos ayudarte, pero ¡esperamos que lo encuentres más fácil
          después del rediseño!
        </p>
        <li>¿Por qué no puedo añadir más información a mi grupo?</li>
        <p>
          ¡Estamos trabajando en esto, y más! Si hay alguna funcionalidad que realmente quieras,
          mandanos un correo o agrega una propuesta en{' '}
          <a href="https://github.com/Covid-Mutual-Aid/groups-map/issues">github</a>.
        </p>
        <li>Algo está roto...</li>
        <p>
          ¡Uy, lo sentimos! El proyecto es bastante nuevo, y esto ocurre de vez en cuando. Por
          favor, mandanos un <a href="mailto:info@mutualaid.wiki">correo</a> para informarnos o{' '}
          <a href="https://github.com/Covid-Mutual-Aid/groups-map/issues">agrega una propuesta</a>.
        </p>
        <li>¿Quién está detrás de esto?</li>
        <p>
          Somos un grupo de voluntarios autodirigido y hacemos software de código abierto. También
          somos parte del equipo tecnico de{' '}
          <a href="https://covidmutualaid.org">covidmutualaid.org</a>
        </p>
      </ul>
      <br />

      <p>Aquí puedes encontrar más información:</p>
      <ul>
        <li>
          Nuestro correo: <a href="mailto:info@mutualaid.wiki">info@mutualaid.wiki</a>
        </li>
        <li>
          Nuestro <a href="https://github.com/Covid-Mutual-Aid/groups-map">código en github</a>
        </li>
      </ul>
      <br />
      <p>¡Incorpóranos en tu propio sitio!</p>
      <code>{`<iframe src="https://mutualaid.wiki/"></iframe>`}</code>
      <br />
      <br />
      <br />

      <p>
        Con{' '}
        <span aria-label="heart emoji" role="img">
          ❤️
        </span>
      </p>
      <p>El equipo Mutual Aid Wiki</p>
    </div>
  )
}

export default AboutES
