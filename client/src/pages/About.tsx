import React from 'react'
import styled from 'styled-components'
import icons from '../utils/icons'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nProvider'

const AboutPage = () => {
  const aboutInformation = useI18n(locale => locale.components.about)
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
        {aboutInformation}
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
