import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { gtag } from '../utils/gtag'
import copy from 'copy-to-clipboard'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!inIframe()) {
      gtag('event', 'Viewed on covidmutualaid.cc', {
        event_category: 'Iframe',
        event_label: 'Viewed without iframe',
      })
    }
  })

  return (
    <div>
      <div className="embed-code">{!inIframe() && <EmbedCode />}</div>
      {children}
      <Footer />
    </div>
  )
}

const embedCode = `<iframe src="https://covidmutualaid.cc/" frameborder="0" width="1200" height="1400"
title="Covid-19 Mutual Aid Groups" aria-label="United Kingdom local authority districts (2018) Symbol map" scrolling="no" style="border: none;" frameborder="0">
</iframe>`

const Footer = () => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  return (
    <div className="footer">
      <a target="_blank" href="https://covidmutualaid.cc/">
        visit full site
      </a>
      <span
        className="link"
        onClick={e => {
          copy(embedCode)
          setCopiedToClipboard(true)
        }}
      >
        {!copiedToClipboard ? 'embed this map' : 'code copied to clipboard!'}
      </span>
      {/* <p>This map is updated every 5 minutes</p> */}
      <a href="mailto:covidmutualaid.cc@gmail.com">covidmutualaid.cc@gmail.com</a>
      <a target="_blank" href="https://github.com/Covid-Mutual-Aid/search-by-postcode">
        open sourced on github
      </a>
    </div>
  )
}

const EmbedCode = () => {
  const [show, setShow] = useState(false)
  return (
    <>
      <p className="primary" onClick={() => setShow(true)}>
        embed this map into your website
      </p>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Embed Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <code>{embedCode}</code>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
