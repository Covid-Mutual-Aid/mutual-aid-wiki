import React from 'react'
import icons from '../icons'

const AboutEN = () => {
  return (
    <div>
      <ul>
        <li>Can I edit my group info?</li>
        <p>
          Yes! Find your group in the sidebar, click the {icons('more')} icon on the top right
          corner and select edit group from the dropdown. Submit your email and check your inbox for
          further instructions 🙂.
        </p>
        <li>Can I report a group?</li>
        <p>
          Yes, click the {icons('more')} icon on the top right corner and select report group from
          the dropdown. Once you have completed the form, we will review your report and remove the
          group if we deem it appropriate. We will usually remove the group if it is a link to an
          individual, spam or promotional, no longer accesible or spreading hate
          speech/misinformation.
        </p>
        <li>Is my personal data safe?</li>
        <p>
          While your group information is public, the email addresses you provide are not. We care a
          lot about privacy and will not disclose this without your written consent.
        </p>
        <li>Can you help me find my group?</li>
        <p>
          If you send us an email we will do our best to help, but we hope you find this easier
          after the recent redesign!
        </p>
        <li>Why can't I add more information to my group?</li>
        <p>
          We are working on this and more. If there is a feature you would really like, please email
          us or create an issue on{' '}
          <a href="https://github.com/Covid-Mutual-Aid/groups-map/issues">github</a>
        </p>
        <li>Something is broken...</li>
        <p>
          Oops, sorry about this. The project is quite young and this does happen from time to time.
          Would you kindly send us an <a href="mailto:info@mutualaid.wiki">email</a> to let us know
          or <a href="https://github.com/Covid-Mutual-Aid/groups-map/issues">create an issue</a>?
        </p>
        <li>Who is behind this?</li>
        <p>
          We are an open source, volunteer run group of. We also part of the technical team at{' '}
          <a href="https://covidmutualaid.org">covidmutualaid.org</a>
        </p>
      </ul>
      <br />

      <p>Here is some information you may find useful:</p>
      <ul>
        <li>
          Our email <a href="mailto:info@mutualaid.wiki">info@mutualaid.wiki</a>
        </li>
        <li>
          Our <a href="https://github.com/Covid-Mutual-Aid/groups-map">source code on github</a>
        </li>
      </ul>
      <br />
      <br />
      <p>
        With{' '}
        <span aria-label="heart emoji" role="img">
          ❤️
        </span>
      </p>
      <p>Mutual Aid Wiki team</p>
      <br />
      <br />
    </div>
  )
}

export default AboutEN
