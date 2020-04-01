import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import GroupsMapPage from './pages/GroupsMapPage'
import CreateGroupPage from './pages/CreateGroupPage'
import EditGroupPage from './pages/EditGroupPage'
import { gtag } from './utils/gtag'
import { Button, Modal } from 'react-bootstrap'
import copy from 'copy-to-clipboard'
import SearchesPage from './pages/SearchesPage'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

const embedCode = `<iframe src="https://covidmutualaid.cc/" frameborder="0" width="1200" height="1400"
title="Covid-19 Mutual Aid Groups" aria-label="United Kingdom local authority districts (2018) Symbol map" scrolling="no" style="border: none;" frameborder="0">
</iframe>`

function App() {
  const [show, setShow] = useState(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
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
        {!inIframe() ? (
          <>
            <p className="primary" onClick={handleShow}>
              embed this map into your website
            </p>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Embed Code</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <code>{embedCode}</code>
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
          <Route path="/edit-group/:id">
            <EditGroupPage />
          </Route>
          <Route path="/searches">
            <SearchesPage />
          </Route>
          <Route path="/">
            <GroupsMapPage />
          </Route>
        </Switch>
      </Router>
      <div className="footer">
        <a target="_blank" href="https://airtable.com/shrHitFm25IJ2bo10">
          edit your group
        </a>
        <a target="_blank" href="https://covidmutualaid.cc/">
          full site
        </a>
        <span
          className="link"
          onClick={e => {
            copy(embedCode)
            setCopiedToClipboard(true)
          }}
        >
          {!copiedToClipboard ? 'embed' : 'code copied!'}
        </span>
        <a href="mailto:covidmutualaid.cc@gmail.com">covidmutualaid.cc@gmail.com</a>
        <a target="_blank" href="https://github.com/Covid-Mutual-Aid/search-by-postcode">
          open source
        </a>
      </div>
    </div>
  )
}

export default App
