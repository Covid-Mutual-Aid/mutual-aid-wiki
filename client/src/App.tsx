import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GroupsMapPage from './pages/GroupsMapPage'
import CreateGroupPage from './pages/CreateGroupPage'
import { gtag } from './utils/gtag'
import { Button, Modal } from 'react-bootstrap'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

function App() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    if (!inIframe()) {
      gtag('event', 'Viewed on covidmutualaid.cc', {
        event_category: 'Iframe',
        event_label: 'Viewed without iframe',
      })
    }
  })

  return (
    <div className={inIframe() ? 'App' : 'App-Standalone'}>
      <div className="embed-code">
        {inIframe() ? (
          <>
            <p className="primary" onClick={handleShow}>
              embed this map into your website
            </p>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Embed Code</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <code>
                  {`<iframe src="https://covidmutualaid.cc/" frameborder="0" width="1200" height="1400"
                      title="Covid-19 Mutual Aid Groups" aria-label="United Kingdom local authority districts (2018) Symbol map" scrolling="no" style="border: none;" frameborder="0">
                    </iframe>`}
                </code>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          ''
        )}
      </div>
      <Router>
        <Switch>
          <Route path="/create-group">
            <CreateGroupPage />
          </Route>
          <Route path="/">
            <GroupsMapPage />
          </Route>
        </Switch>
      </Router>
      <div className="footer">
        <a target="_blank" href="https://github.com/Covid-Mutual-Aid/search-by-postcode">
          open sourced on github
        </a>
        <a href="#" onClick={handleShow}>
          embed this map
        </a>
        {/* <p>This map is updated every 5 minutes</p> */}
        <a href="mailto:covidmutualaid.cc@gmail.com">covidmutualaid.cc@gmail.com</a>
      </div>
    </div>
  )
}

export default App
