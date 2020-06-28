import { useLocation, useHistory, Link } from 'react-router-dom'
import React, { useLayoutEffect } from 'react'
import styled from 'styled-components'
import useInView from 'react-cool-inview'

import { useGroupsList } from '../state/reducers/groups'
// import { MOBILE_BREAKPOINT } from '../utils/CONSTANTS'
// import { useI18n } from '../contexts/I18nProvider'
import inIframe from '../utils/inIframe'

import info_add from './img/info_add.png'
import info_edit from './img/info_edit.png'
import info_embed from './img/info_embed.png'

import peony from './img/peony.jpg'
import LogoBold from './img/SVGs/MAW_LOGO_BOLD.svg'
import Roundel from './img/SVGs/MAW_ROUNDEL_1.svg'
import Smiley from './img/SVGs/MAW_SMILEY.svg'
import RoundelSimon from './img/SVGs/ROUNDEL_SIMON_3.svg'
import VolunteerBold from './img/SVGs/VOLUNTEER_BOLD.svg'

const Information = () => {
  const groups = useGroupsList()
  const history = useHistory()
  const { pathname, search } = useLocation()
  // const localizedComponents = useI18n((x) => x.components)
  // const aboutInformation = localizedComponents.about
  // const heroContent = localizedComponents.heroContent
  // const highlightsContent = localizedComponents.highlightsContent
  // const addGroupContent = localizedComponents.addGroupContent
  // const editGroupContent = localizedComponents.editGroupContent
  // const embedMapContent = localizedComponents.embedMapContent
  // const sourcesContent = localizedComponents.sourcesContent

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.3, // Default is 0
  })

  useLayoutEffect(() => console.log(inView))

  useLayoutEffect(() => {
    if (inIframe() && pathname === '/') {
      history.replace('/map/' + search)
    }
  }, [pathname, history, search])

  return (
    <LandingStyles open={pathname === '/'}>
      <EdStyles>
        <header>
          <nav>
            <img alt="logo" className="logo" src={LogoBold} />
          </nav>
        </header>
        <section className="landingScreen floralWhite">
          <div className="introContainer">
            <div className="introBox">
              <h1 className="introHead black">
                <span className="wer">
                  A{' '}
                  {'community-managed'.split('').map((char, i) => (
                    <span
                      className="baselineShift baselineShifter"
                      style={{ animationDelay: i / 10 + 's' }}
                    >
                      {char}
                    </span>
                  ))}{' '}
                  resource documenting{' '}
                  <span className="blue">
                    <span className="ticker">3,534</span>&nbsp;mutual aid groups
                  </span>{' '}
                  throughout the&nbsp;world.
                </span>
              </h1>
            </div>

            <p className="introP dimGrey">
              Created to enable individuals to connect with their mutual aid communities and to
              enable mutual aid communities find each other, share approaches and support
              one&nbsp;another.
            </p>

            <div className="visitMapBox">
              <p className="vis">
                <Link className="visitMap" to="/map">
                  Visit the map
                </Link>
              </p>
              <p className="vis">
                <Link className="visitMap" to="/map/add-group">
                  Add a group
                </Link>
              </p>
            </div>
          </div>

          <div className="homepageImage">
            <img alt="" className="PG" src={peony} />
          </div>
        </section>

        <section className="mapPreview">
          <div className="mapOverlay">
            <Link className={'visitMap viewMap'} to="/map">
              VISIT THE MAP
            </Link>
          </div>
        </section>

        <section ref={inViewRef} className="lightGrey aboutTester iconHolder">
          <p data-splitting className="centredText blue">
            About mutual aid wiki
          </p>

          <div className="aboutBlock openSourceBlock">
            <h6 className="typoIcon openSourceRoundel">
              {['OPEN-SOURCECRUOS-NEP']
                .map(
                  (txt) =>
                    [txt.split(''), txt.length, 360 / txt.length] as [string[], number, number]
                )
                .map(([text, length, degree]) =>
                  text.map((char, i) => (
                    <span
                      className={`fadeIn ${inView && 'fader'} circleText ${
                        i > length * 0.5 ? 'blue' : 'dimGrey'
                      }`}
                      style={{
                        transform: `rotate( ${i * degree}deg)`,
                        transitionDelay: i * 40 * 2 + 'ms',
                      }}
                    >
                      <span style={{ transform: `rotate(${-i * degree}deg)` }} className="spinner">
                        {char}
                      </span>
                    </span>
                  ))
                )}
            </h6>

            <p className="aboutText dimGrey openSourceText">
              All of our code is published with an open source license. We&nbsp;accept pull requests
              and actively rely on the work of volunteers to maintain this project.
            </p>
          </div>

          <div className="aboutBlock">
            <h6 className="typoIcon">
              <span className="dimGrey">
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 2 + 'ms',
                  }}
                >
                  c<br />
                </span>
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 3 + 'ms',
                  }}
                >
                  com&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c
                  <br />
                </span>
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 4 + 'ms',
                  }}
                >
                  commu&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cre
                  <br />
                </span>
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 5 + 'ms',
                  }}
                >
                  communi&nbsp;&nbsp;&nbsp;creat
                  <br />
                </span>
              </span>

              <span className="blue">
                <span className={`fadeIn ${inView && 'fader'}`}>community&nbsp;created</span>
              </span>
            </h6>

            <p className="aboutText dimGrey">
              We are developing this resource together with organising groups from all over the
              world to make sure that this data is used for the benefit of the global mutual aid
              community.
            </p>
          </div>

          <div id="communities" className="aboutBlock">
            <h6 className="typoIcon">
              <span className="dimGrey">
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 2 + 'ms',
                  }}
                >
                  &nbsp;&nbsp;&nbsp;{groups.length - 3}
                  <br />
                </span>
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 3 + 'ms',
                  }}
                >
                  &nbsp;&nbsp;{groups.length - 2}
                  <br />
                </span>
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 4 + 'ms',
                  }}
                >
                  &nbsp;{groups.length - 1}
                  <br />
                </span>
              </span>

              <span className="blue">
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 5 + 'ms',
                  }}
                >
                  {groups.length}
                  <br />
                </span>
                <span
                  className={`fadeIn ${inView && 'fader'}`}
                  style={{
                    transitionDelay: 220 * 6 + 'ms',
                  }}
                >
                  communities
                </span>
              </span>
            </h6>

            <p className="aboutText dimGrey">
              This resource currently documents {groups.length} groups from around the world, with
              new groups being added daily. Please get in touch if you would like to sync your data.
            </p>
          </div>
        </section>

        <section className="volunteer">
          <div className="volunteerContainer"></div>
        </section>

        <section className="lightGrey works">
          <p data-splitting className="centredText blue">
            HOW IT WORKS
          </p>

          <div className="howItWorks">
            <div className="textContainer">
              <p className="demoText">
                <span className="blue">
                  Add your group
                  <br />
                </span>
                <span className="dimGrey">
                  Add your group to the map immediately. You can specify your group’s location by
                  dropping a marker or defining a perimeter.
                </span>
              </p>
            </div>

            <div className="screebgrabContainer">
              <img alt="" className="screengrab" src={info_add} />
            </div>

            <div className="textContainer">
              <p className="demoText">
                <span className="blue">
                  Edit your group
                  <br />
                </span>
                <span className="dimGrey">
                  Edit your groups information with the email used to create it, or verify your
                  email with an existing group to edit it.
                </span>
              </p>
            </div>

            <div className="screebgrabContainer">
              <img alt="" className="screengrab" src={info_edit} />
            </div>

            <div className="textContainer">
              <p className="demoText">
                <span className="blue">
                  Embed this map
                  <br />
                </span>
                <span className="dimGrey">
                  To get the functionality of this map on your website, just paste the the following
                  code into your page. We are happy to help if you’re not sure.
                  <br />
                </span>
              </p>

              <h5 id="iframetext" className="dimGrey">
                &#60;iframe
                <br />
                &nbsp;src="https://mutualaid.wiki"
                <br />
                &#60;/iframe&#x3e;.
              </h5>
            </div>

            <div className="screebgrabContainer">
              <img alt="" className="screengrab" src={info_embed} />
            </div>

            <div className="textContainer">
              <p className="demoText">
                <span className="blue">
                  Sync your data
                  <br />
                </span>
                <span className="dimGrey">
                  We are syncing data from a number of community sources as seen below. Get in touch
                  to add your source, or submit a{' '}
                  <a href="https://github.com/Covid-Mutual-Aid/mutual-aid-wiki">
                    pull&nbsp;request
                  </a>
                  .
                </span>
              </p>
            </div>

            <div style={{ width: '100%' }} className="screebgrabContainer">
              <iframe
                title="Sources"
                className="screengrab"
                src="https://airtable.com/embed/shrgJ4OdI7KBMWVqj?backgroundColor=green"
                frameBorder="0"
                width="100%"
                height="540"
                style={{ background: 'transparent; border: 1px solid #ccc', maxWidth: '100%' }}
              ></iframe>
            </div>
          </div>
        </section>

        <section className="blackBackground">
          <div className="roundelContainer">
            <img alt="" className="roundel" id="roundel1" src={Roundel} />
            <img alt="" className="roundel" id="roundel2" src={RoundelSimon} />
          </div>
        </section>

        <section className="FAQ lightGrey">
          <div className="faq-content">
            <p data-splitting className="centredText blue">
              F.A.Q.
            </p>

            <p className="dimGrey questions">
              <span className="blue">Can I edit my group info?</span>
              <br />
              Yes! Find your group in the sidebar, click the icon on the top right corner and select
              edit group from the dropdown. Submit your email and check your inbox for further
              instructions 🙂.
              <br />
              <br />
              <span className="blue">Can I report a group?</span>
              <br />
              Yes, click the icon on the top right corner and select report group from the dropdown.
              Once you have completed the form, we will review your report and remove the group if
              we deem it appropriate. We will usually remove the group if it is a link to an
              individual, spam or promotional, no longer accesible or spreading hate
              speech/misinformation.
              <br />
              <br />
              <span className="blue">Is my personal data safe?</span>
              <br />
              While your group information is public, the email addresses you provide are not. We
              care a lot about privacy and will not disclose this without your written consent.
              <br />
              <br />
              <span className="blue">Can you help me find my group?</span>
              <br />
              If you send us an email we will do our best to help, but we hope you find this easier
              after the recent redesign!
              <br />
              <br />
              <span className="blue">Why can't I add more information to my group?</span>
              <br />
              We are working on this and more. If there is a feature you would really like, please
              email us or create an issue on github
              <br />
              <br />
              <span className="blue">Something is broken...</span>
              <br />
              Oops, sorry about this. The project is quite young and this does happen from time to
              time. Would you kindly send us an email to let us know or create an issue?
              <br />
              <br />
              <span className="blue">Who is behind this?</span>
              <br />
              We are an open source, volunteer run group from different countries. We also part of
              the technical team at covidmutualaid.org. Get in touch if you would like to work with
              us!
              <br />
              <br />
              Here is some information you may find useful:
              <br />
              Our email <a href="mailto:info@mutualaid.wik ">info@mutualaid.wiki</a>
              <br />
              Our source code on{' '}
              <a href="https://github.com/Covid-Mutual-Aid/mutual-aid-wiki">github</a>
              <br />
              <br />
              With ❤️ Mutual Aid Wiki team
            </p>
          </div>
        </section>

        <section className="tanBackground" style={{ height: '100%' }}>
          <div className="FAQ">
            <p data-splitting className="centredText blue">
              Website Credits
            </p>

            <p data-splitting className="questions" style={{ textAlign: 'center' }}>
              By <a href="https://tapal.es">Julian Tapales</a> and{' '}
              <a href="https://www.danbeaven.com/">Dan Beaven</a>
              <br />
              <br />
              With <a href="https://www.linkedin.com/in/tim-cowlishaw-0204a6151/">Tim Cowlishaw</a>
              <br />
              <br />
              Design by <a href="https://edcornish.com/">Edward Cornish Studio</a>
              <br />
              <br />
              Illustrations by <a href="https://www.peonygent.com/">Peony Gent</a>
              <br />
              <br />
              And help of <a href="https://www.linkedin.com/in/oliviervroom/">Olivier Vroom</a>
              <br />
              <br />
              With special thanks to Katie K, Rob Morrissey, Natasha Hicken, Nicole Poor, the folks
              at COVID Mutual Aid UK and others we have collaborated with
              <br />
              <br />
              <br />
              <br />
              <img alt="" style={{ width: '60px' }} src={Smiley} />
            </p>
          </div>
        </section>
      </EdStyles>
    </LandingStyles>
    // <LandingStyles open={pathname === '/'}>
    //   <Hero>{heroContent}</Hero>
    //   <Highlight>{highlightsContent}</Highlight>

    //   <Feature tint={'rgb(244, 250, 255)'}>
    //     <div className="wrapper">
    //       {addGroupContent}
    //       <div className="spacer"></div>
    //       <div className="img">
    //         <img alt=""  alt="Add a group" src={info_add} />
    //       </div>
    //     </div>
    //   </Feature>
    //   <Feature tint={'rgb(255, 255, 255)'}>
    //     <div className="wrapper">
    //       <div className="img">
    //         <img alt=""  alt="Edit a group" src={info_edit} />
    //       </div>
    //       <div className="spacer"></div>
    //       {editGroupContent}
    //     </div>
    //   </Feature>
    //   <Feature tint={'rgb(244, 250, 255)'}>
    //     <div className="wrapper full">
    //       <div className="description">{sourcesContent}</div>
    //       <div className="spacer"></div>
    //       <div className="img">
    //         <iframe
    //           title="Sources"
    //           className="airtable-embed"
    //           src="https://airtable.com/embed/shrgJ4OdI7KBMWVqj?backgroundColor=green"
    //           frameBorder="0"
    //           width="100%"
    //           height="320"
    //           style={{ background: 'transparent; border: 1px solid #ccc' }}
    //         ></iframe>
    //       </div>
    //     </div>
    //   </Feature>
    //   <Feature tint={'rgba(0, 0, 0, 0.8)'}>
    //     <div className="wrapper">
    //       <div className="description white">
    //         {embedMapContent}
    //         <code>{`<iframe `}</code>
    //         <br />
    //         <code>&nbsp;{`src="https://mutualaid.wiki">`}</code>
    //         <br />
    //         <code>{`</iframe>`}</code>
    //       </div>
    //       <div className="spacer"></div>
    //       <div className="img">
    //         <img alt=""  alt="Embed a group" src={info_embed} />
    //       </div>
    //     </div>
    //   </Feature>
    //   <FAQ>
    //     <div className="wrapper">
    //       <div className="title">
    //         <h1>FAQ</h1>
    //       </div>
    //       {aboutInformation}
    //     </div>
    //   </FAQ>
    // </LandingStyles>
  )
}

export default Information

const EdStyles = styled.div`
  margin: 0;
  font-family: sans-serif;
  font-weight: 400;
  font-style: normal;

  * {
    box-sizing: content-box;
  }

  section {
    box-sizing: border-box;
    display: flex;
    width: 100vw;
    min-height: 100vh;
    margin: auto;
    flex-flow: row wrap;
    justify-content: space-evenly;
    overflow: hidden;
  }

  /* T Y P O G R A P H Y */
  h1 {
    font-family: 'Gap-Sans', 'Helvetica Neue', sans-serif;
    font-weight: lighter;
    text-align: left;
    font-size: 3vw;
    line-height: 2.75vw;
    letter-spacing: 0.1vw;
  }

  p {
    font-family: neue-haas-unica, 'Helvetica Neue', sans-serif;
    font-weight: 400;
    letter-spacing: 0.5px;
    line-height: 23px;
    text-align: left;
  }

  p a {
    color: black;
    text-decoration: none;
  }

  p a:hover {
    color: blue;
  }

  h6 {
    /*     font-family: "Compagnon-Roman", Courier, monospace; */
    font-family: Courier, monospace;
    font-weight: lighter;
    letter-spacing: 0.5em;
    text-align: left;
    font-size: 1em;
    line-height: 22px;
    text-transform: uppercase;

    display: inline-block;
    margin: auto;
  }

  a {
    text-decoration: none;
  }

  .italics {
    font-style: italic;
  }

  /* S E C T I O N S */

  .landingScreen {
    display: flex;
    flex-flow: row wrap;
  }

  .intro {
  }

  .introContainer {
    width: 35vw;
    margin: auto 0 auto 0;
    padding-left: 30px;
  }

  .introHead {
    padding-bottom: 25px;
  }

  .introP {
    max-width: 350px;
    margin-bottom: 50px;
    padding-right: 50px;
  }

  .homepageImage {
    mix-blend-mode: multiply;
    margin: auto 0px auto 0px;
  }

  .PG {
    max-width: 52vw;
    max-height: 100vh;
  }

  .scaler {
    transform: scale(2);
    transform-origin: -10px -0px;
    transition: transform(0.5s);
  }

  #os {
    margin-top: 100px;
  }

  .iconBox {
    max-width: 400px;
    display: block;
    margin: auto;
    padding: 0 30px 0 30px;
  }

  /* C O L O U R S */
  .dimGrey {
    color: dimgrey;
  }

  .midGrey {
    color: #969696;
  }

  .black {
    color: black;
  }

  .blue {
    color: blue;
  }

  .blueBackground {
    background-color: blue;
  }

  .lightGrey {
    color: whitesmoke;
    background-color: whitesmoke;
  }

  .blackBackground {
    background-color: black;
  }

  .white {
    color: white;
  }

  .floralWhite {
    background-color: floralWhite;
  }

  .red {
    color: red;
    background-color: red;
  }

  .redBackground {
    background-color: red;
  }

  .tanBackground {
    background-color: tan;
  }

  /* Starting opacity for all text */
  .fadeIn {
    opacity: 0;
    transition: opacity 0.2s;
  }

  /* Added to each individual span by the Javascript */
  .fader {
    opacity: 1;
    transition: opacity 0.1s;
  }

  /* Sets the offset for the rotation of the characters in OPEN-SOURCE */
  .circleText {
    position: absolute;
    transform-origin: 0.65em 70px;
  }

  /* Positions the OPEN-SOURCE back in the centre of its container */
  .openSourceRoundel {
    transform: translateY(-20px);
  }

  /* Keeps all the letters in OPEN-SOURCE parrallel when they're rotated back by the Javascript */
  .spinner {
    position: absolute;
  }

  .shearLinks {
    transform: skew(-20deg, 0deg);
  }

  header {
    padding: 20px 0px 20px 0px;
    margin-left: 2.5vw;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 95vw;

    z-index: 10;
  }

  .logo {
    padding: 10px 0px 0px 10px;
    max-width: 65px;
  }

  /* A N I M A T I O N  K E Y F R A M E S*/

  @keyframes roundelSpinner {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-360deg);
    }
  }

  @keyframes faceSpinner {
    0% {
      transform: rotate(-15deg);
    }

    25% {
      transform: rotate(15deg);
    }

    100% {
      transform: rotate(-15deg);
    }
  }

  @keyframes baselineShifter {
    50% {
      vertical-align: 0px;
      /*         color: dimgrey; */
      color: black;
    }

    55% {
      vertical-align: 15px;
      color: blue;
    }

    60% {
      vertical-align: 0px;
      /*         color: dimgrey; */
      color: black;
    }
  }

  .baselineShifter {
    animation: baselineShifter 3s infinite;
  }

  .wer {
    vertical-align: -15px;
  }

  #roundel2 {
    animation: roundelSpinner 30s infinite linear;
  }

  #roundel1 {
    animation: faceSpinner 5s infinite;
  }

  .roundelContainer {
    width: 350px;
    height: 350px;
    position: relative;
    margin: auto;
  }

  .roundel {
    position: absolute;
  }

  .volunteer {
    position: relative;
    display: inline-block;
    background-color: greenyellow;
    text-align: center;
    margin-bottom: -5px;
  }

  .volunteerContainer {
    position: relative;
    width: 100%;
    height: 100vh;
    margin: auto;
    background-image: url(${VolunteerBold});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 90%;

    /*background-color: red;*/
  }

  .centredText {
    /*     font-family: "Gap-Sans", "Helvetica", sans-serif; */
    /*     font-weight: bolder; */

    font-family: neue-haas-unica, sans-serif;
    position: absolute;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    margin: 50px auto 50px auto;
    letter-spacing: 2.5px;
  }

  .map {
    position: relative;
    width: 100%;
    padding: 20px;
    border: 0px;
  }

  .mapPreview {
    border: 20px solid rgb(0, 0, 255);
  }

  .mapOverlay {
    position: relative;
    width: 100%;
    height: calc(100vh - 40px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 255, 0.6);
    color: white;
  }

  .viewMap {
    color: white !important;
    font-size: 1.8rem;
  }

  .works {
    height: 100%;
  }

  .howItWorks {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    max-width: 800px;
    margin: 150px 20px 0px 20px;
    padding: 20px;
  }

  .textContainer {
    max-width: 400px;
    margin-bottom: 20px;
  }

  .screengrab {
    display: inline-block;
    max-width: 400px;
    box-shadow: 0px 5px 5px rgba(0, 0, 255, 0.5);
    border-radius: 5px;
    margin: 0px 0px 75px 0px;
  }

  .demoText {
    padding-right: 50px;
  }

  #iframetext {
    font-family: courier, monospace;
    font-weight: lighter;
    margin-top: 0px;
  }

  .visitMap {
    color: blue;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    transition: 0.25s;
    padding: 20px 20px 20px 0px;
    /*margin: -20px;*/
  }

  .visitMap:hover {
    margin-left: 10px;
    transition: 0.25s;
    font-style: italic;
  }

  .FAQ {
    display: flex;
    justify-content: center;
  }

  .faq-content {
    position: relative;
    max-width: 800px;
    height: 100%;
  }

  .questions {
    margin: 150px 30px 100px 30px;
  }

  .aboutText {
    text-align: center;
  }

  .aboutBlock {
    width: 28%;
    height: 280px;
    margin-top: 35vh;
    text-align: center;
  }

  .typoIcon {
    margin-bottom: 20px;
  }

  .openSourceText {
    margin-top: 122.5px;
  }

  /*  M O B I L E  A L T E R A T I O N S */

  @media (max-width: 1100px) {
    .aboutBlock {
      width: 45%;
      margin-top: 20vh;
    }

    #communities {
      margin-top: -100px;
    }
  }

  @media (max-width: 900px) {
    h1 {
      font-size: 25px;
      line-height: 18px;
      letter-spacing: 1.5px;
    }

    p {
      font-size: 15px;
      line-height: 22px;
    }

    h6 {
      font-size: 15px;
      line-height: 20px;
    }

    .introContainer {
      margin-top: 75px;
      margin-bottom: 25px;
      width: 80%;
      height: 100%;
      padding-left: 10px;
    }

    .landingScreen {
      height: 100%;
    }

    .map {
      padding: 10px;
    }

    .roundelContainer {
      width: 200px;
      height: 200px;
    }

    .introP {
      max-width: 500px;
      margin-bottom: 25px;
    }

    .PG {
      max-width: 100vw;
      max-height: 100vh;
    }

    .openSourceText {
      margin-top: 110px;
    }

    .logo {
      width: 50px;
    }

    .screengrab {
      max-width: 100%;
    }
  }

  @media (max-width: 600px) {
    .aboutTester {
      height: 100%;
    }

    .aboutBlock {
      width: 100%;
      margin: 0px 50px 0px 50px;
    }

    #communities {
      margin-top: 0px;
    }

    .openSourceBlock {
      margin-top: 150px;
    }

    .openSourceRoundel {
      transform: translateY(-30px);
    }
  }
`

const LandingStyles = styled.div<{ open: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  transform: translate3d(0, ${(p) => (!p.open ? '100vh' : '0')}, 0);
  visibility: ${(p) => (p.open ? 'inherit' : 'hidden')};
  z-index: 3;
  overflow-y: auto;
  overflow-x: hidden;
  transition: transform 0.4s;
`

// const Hero = styled.div`
//   position: relative;
//   display: flex;
//   background-color: rgba(0, 0, 0, 0.74);
//   height: calc(24rem + 12vw);
//   justify-content: center;
//   align-items: center;

//   .map {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     z-index: -1;
//   }

//   .hero-content {
//     width: 30rem;
//     padding: 1rem;
//     color: white;
//   }

//   .buttons a {
//     display: block;
//     margin: 1rem 1rem 0 0;
//   }

//   @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
//     height: calc(24rem + 32vh);
//   }
// `

// const Highlight = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 4rem 0;
//   background-color: white;

//   .wrapper {
//     justify-content: space-evenly;
//     width: 72rem;
//     display: flex;
//     flex-direction: row;
//     padding: 2rem 0;

//     div {
//       width: 16rem;
//       padding: 1rem;

//       p {
//         color: rgb(87, 87, 87);
//       }
//     }
//   }

//   @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
//     padding: 1rem 0;
//     .wrapper {
//       flex-direction: column;
//       div {
//         width: 100%;
//       }
//     }
//   }
// `

// const Feature = styled.div<{ tint: string; full?: boolean }>`
//   position: relative;
//   display: flex;
//   justify-content: center;
//   padding: 4rem 0;
//   background-color: ${(p) => p.tint};

//   .white {
//     color: white;
//   }

//   .wrapper {
//     padding: 1rem;
//     max-width: 60rem;
//     display: flex;
//     flex-direction: row;
//   }

//   .description {
//     h3 {
//       color: rgb(138, 138, 138);
//     }
//   }

//   .spacer {
//     width: 6rem;
//   }

//   .img {
//     position: relative;
//     height: 20rem;
//     min-width: 30rem;
//   }

//   img {
//     width: 100%;
//     height: auto;
//     border-radius: 6px;
//     box-shadow: 0px 0px 22px -9px #959595;
//     border: 1px solid rgb(225, 225, 225);
//     background-size: contain;
//     background-color: transparent;
//     background-repeat: no-repeat;
//   }

//   .full {
//     flex-wrap: wrap;

//     .img {
//       min-width: 100%;
//     }
//   }

//   @media (max-width: ${MOBILE_BREAKPOINT + 120 + 'px'}) {
//     code {
//       font-size: 0.72rem;
//     }
//   }

//   @media (max-width: ${MOBILE_BREAKPOINT + 'px'}) {
//     padding: 1rem;

//     .wrapper {
//       flex-direction: column;
//     }

//     .img {
//       order: 1;
//       min-width: 100%;
//       height: 100%;
//     }

//     .description {
//       order: 2;
//       code {
//         font-size: 1rem;
//       }
//     }
//     .spacer {
//       display: none;
//     }
//   }
// `

// const FAQ = styled.div`
//   padding: 1rem;
//   background-color: white;
//   display: flex;
//   justify-content: center;

//   .title {
//     text-align: center;
//     padding: 1rem 0;
//   }
//   .wrapper {
//     max-width: 38rem;
//     li {
//       font-size: 1.2rem;
//     }
//   }
// `
