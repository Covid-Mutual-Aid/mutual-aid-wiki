import React from 'react'
import styled from 'styled-components'
import icons from '../utils/icons'
import { useI18n } from '../contexts/I18nProvider'
import { Toggle } from '../styles/styles'

const AboutPage = () => {
  const aboutInformation = useI18n((locale) => locale.components.about)
  return (
    <Center>
      <Content>
        <div className="nav">
          <Toggle />
        </div>

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

  .nav {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.6rem 1rem;
  }
`

const Center = styled.div`
  height: 100vh;
  overflow-x: scroll;
  display: flex;
  justify-content: center;
`

export default AboutPage
