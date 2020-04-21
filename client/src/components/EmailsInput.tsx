import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

const EmailsInput = ({
  emails,
  onChange,
}: {
  emails: string[]
  onChange: (x: string[]) => void
}) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!value) return
    setError('')
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!validEmail(value)) {
          setError('Must be a valid email address')
        } else {
          onChange([...emails, value])
          setValue('')
        }
        event.preventDefault()
    }
  }
  return (
    <div>
      <CreatableSelect
        components={{ DropdownIndicator: null }}
        styles={{
          control: (x) => ({ ...x, borderRadius: '20px', padding: '.4rem' }),
        }}
        inputValue={value}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(x) => onChange(Array.isArray(x) ? x.map((y) => y.value) : [])}
        onInputChange={setValue}
        onKeyDown={handleKeyDown}
        placeholder="Enter any emails..."
        value={emails.map((x) => ({ label: x, value: x }))}
      />
      <p style={{ paddingLeft: '1rem', margin: '.4rem 0rem 0rem 0rem', color: 'red' }}>{error}</p>
    </div>
  )
}

export default EmailsInput

export function validEmail(email: string) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
