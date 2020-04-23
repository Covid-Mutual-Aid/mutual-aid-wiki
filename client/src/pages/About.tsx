import React from 'react'
import styled from 'styled-components'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <Center>
      <Content>
        <Link to="/">
          <div className="back">{icons('map', 'white')}</div>
        </Link>
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1>A global map of COVID-19 Mutual Aid groups</h1>
        <div className="pinned">
          <h4>We are looking for people who can help us with outreach!</h4>
          <p>
            We would love our work to benefit more mutual aid communities and are looking for people
            who can help us connect. If this is your thing, we would love to hear from you at{' '}
            <a href="mailto:info@mutualaid.wiki">info@mutualaid.wiki</a>
          </p>
        </div>
        <p>
          Have a list of groups or want to translate this app? Please also send us an{' '}
          <a href="mailto:info@mutualaid.wiki">email</a>, we would love to hear from you too.
        </p>
        <br />

        <p>FAQ:</p>
        <ul>
          <li>Can I edit my group info?</li>
          <p>
            Yes! Find your group in the sidebar, click the {icons('more')} icon on the top right
            corner and select edit group from the dropdown. Submit your email and check your inbox
            for further instructions 🙂.
          </p>
          <li>Can I report a group?</li>
          <p>
            Yes, click the {icons('more')} icon on the top right corner and select report group from
            the dropdown. Once you have completed the form, we will review your report and remove
            the group if we deem it appropriate. We will usually remove the group if it is a link to
            an individual, spam or promotional, no longer accesible or spreading hate
            speech/misinformation.
          </p>
          <li>Is my personal data safe?</li>
          <p>
            While your group information is public, the email addresses you provide are not. We care
            a lot about privacy and will not disclose this without your written consent.
          </p>
          <li>Can you help me find my group?</li>
          <p>
            If you send us an email we will do our best to help, but we hope you find this easier
            after the recent redesign!
          </p>
          <li>Why can't I add more information to my group?</li>
          <p>
            We are working on this and more. If there is a feature you would really like,{' '}
            <a href="mailto:info@mutualaid.wiki">please email us</a> or create an issue on{' '}
            <a href="https://github.com/Covid-Mutual-Aid/groups-map/issues">github</a>
          </p>
          <li>Something is broken...</li>
          <p>
            Oops, sorry about this. Despite our best efforts, this does happen from time to time.
            Would you kindly send us an <a href="mailto:info@mutualaid.wiki">email</a> to let us
            know or{' '}
            <a href="https://github.com/Covid-Mutual-Aid/groups-map/issues">create an issue</a>?
          </p>
          <li>Who is behind this?</li>
          <p>
            We are a small team of volunteers from mutual aid communities around the world who
            believe in open source collaboration. We are also part of the technical team at{' '}
            <a href="https://covidmutualaid.org">covidmutualaid.org</a>
          </p>
        </ul>
        <br />

        <p>Some further information:</p>
        <ul>
          <li>
            Our email <a href="mailto:info@mutualaid.wiki">info@mutualaid.wiki</a>
          </li>
          <li>
            Our <a href="https://github.com/Covid-Mutual-Aid/groups-map">source code on github</a>
          </li>
        </ul>
        <br />
        <p>Embed us on your site!</p>
        <code>{`<iframe src="https://mutualaid.wiki/"></iframe>`}</code>
        <br />
        <br />
        <br />

        <p>
          With{' '}
          <span aria-label="heart emoji" role="img">
            ❤️
          </span>
          ,
        </p>
        <p>Mutual Aid Wiki team</p>
        <br />
        <br />
        <br />
      </Content>
    </Center>
  )
}

const Content = styled.div`
  max-width: 32rem;
  padding: 1.4rem;
  height: auto;

  .pinned {
    border: solid 1px rgba(0, 255, 0, 0.8);
    border-radius: 8px;
    padding: 1rem;
    margin: 2rem 0;
  }

  h1 {
    font-size: 1.68rem;
  }

  .back {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    border-radius: 10rem;
    width: 2rem;
    height: 2rem;
    background-color: lightgreen;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.6rem;
    margin: 1rem;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0px 0px 22px -4px rgba(111, 111, 111, 0.69);
    }

    a {
      line-height: 0;
    }
  }
`

const Center = styled.div`
  height: 100vh;
  overflow-x: scroll;
  display: flex;
  justify-content: center;
`

export default AboutPage
