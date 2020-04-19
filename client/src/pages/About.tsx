import React from 'react'
import SecondaryPage from './SecondaryPage'
import { CenterAlign } from '../styles/styles'
import styled from 'styled-components'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <Center>
      <Content>
        <div className="back">
          <Link to="/">{icons('map', 'white')}</Link>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <h2>Everything!</h2>
        <p>
          Thanks for visiting our project. We are an open source, volunteer run initiative creating
          tools for mutual aid groups. We also form part of the technical team at{' '}
          <a href="https://covidmutualaid.org">covidmutualaid.org</a>.
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
          <li>Why can't I add more information to my group or report a group?</li>
          <p>
            We are working on these things and more. Check back in a week to see where we have got
            to...
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
        <p>Embed us on your site!</p>
        <code>{`<iframe src="https://mutualaid.wiki/"></iframe>`}</code>
        <br />
        <br />
        <br />

        <p>With ❤️,</p>
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
