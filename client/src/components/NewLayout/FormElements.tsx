import React, { useState } from 'react'

type WithValidation = {
  value: string
  validated: boolean
}

export const Input = ({
  placeholder = '',
  value,
  onChange,
  validator,
  errorMsg = '',
}: {
  placeholder?: string
  value: string
  onChange: (s: WithValidation) => void
  validator: (sn: string) => boolean
  errorMsg?: string
}) => {
  console.log(value, validator(value), value.length)
  return (
    <>
      {errorMsg.length > 0 ? <label>errorMsg</label> : null}
      <input
        style={{
          backgroundColor:
            value.length > 0
              ? validator(value)
                ? 'rgba(0, 255, 0, 0.1)'
                : 'rgba(255, 0, 0, 0.1)'
              : 'inherit',
        }}
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => {
          onChange({ value: target.value, validated: validator(target.value) })
        }}
      />
    </>
  )
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export function validEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
